using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Threading.Tasks;

public class MongoDBContext
{
    private readonly IMongoDatabase _database;

    public MongoDBContext(IOptions<MongoDBSettings> options)
    {
        var settings = MongoClientSettings.FromConnectionString(options.Value.ConnectionString);
        settings.ServerApi = new ServerApi(ServerApiVersion.V1);
        var client = new MongoClient(settings);
        _database = client.GetDatabase(options.Value.DatabaseName);

        try
        {
            var result = _database.RunCommand<BsonDocument>(new BsonDocument("ping", 1));
            Console.WriteLine("Pinged your deployment. You successfully connected to MongoDB!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred while connecting to MongoDB: {ex.Message}");
        }
    }

    public IMongoCollection<User> Users => _database.GetCollection<User>("users");

    public async Task<bool> IsUsernameTakenAsync(string username)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Username, username);
        var user = await Users.Find(filter).FirstOrDefaultAsync();
        return user != null;
    }

    public async Task<bool> IsEmailTakenAsync(string email)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Email, email);
        var user = await Users.Find(filter).FirstOrDefaultAsync();
        return user != null;
    }
}

public class MongoDBSettings
{
    public string ConnectionString { get; set; }
    public string DatabaseName { get; set; }
}

public class User
{
    [BsonElement("_id")]
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string Username { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string Dob { get; set; }
    public phone Phone { get; set; }
}

public class phone
{
    public string Number { get; set; }
    public string InternationalNumber { get; set; }
    public string NationalNumber { get; set; }
    public string E164Number { get; set; }
    public string CountryCode { get; set; }
    public string DialCode { get; set; }
}
