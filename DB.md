
# MongoDB Database Configuration and Structure

This document provides an overview of the MongoDB setup used in this project, including the database structure, connection settings, and relevant scripts.

## MongoDB Settings

The MongoDB connection settings are defined in the `appsettings.json` file. These settings include the connection string and the database name.

```json
{
    "MongoDB": {
        "ConnectionString": "mongodb+srv://root:246810@tolunayakkoyun.gtzo7.mongodb.net/?retryWrites=true&w=majority&appName=TolunayAkkoyun",
        "DatabaseName": "usersForTask"
    }
}
```

- **ConnectionString:** This is the connection string used to connect to the MongoDB Atlas cluster. It includes the username, password, and the cluster address.
- **DatabaseName:** The name of the database where user data is stored, in this case, `usersForTask`.

## MongoDBContext Class

The `MongoDBContext` class is responsible for establishing the connection to the MongoDB database and providing access to the `users` collection.

```csharp
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
```

### Key Methods:
- **IsUsernameTakenAsync:** Checks if a given username is already present in the database.
- **IsEmailTakenAsync:** Checks if a given email is already present in the database.

## MongoDBSettings Class

The `MongoDBSettings` class holds the connection string and database name, which are provided via dependency injection.

```csharp
public class MongoDBSettings
{
    public string ConnectionString { get; set; }
    public string DatabaseName { get; set; }
}
```

## User Model

The `User` class defines the structure of the user data that will be stored in the `users` collection in MongoDB.

```csharp
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
    public Phone Phone { get; set; }
}

public class Phone
{
    public string Number { get; set; }
    public string InternationalNumber { get; set; }
    public string NationalNumber { get; set; }
    public string E164Number { get; set; }
    public string CountryCode { get; set; }
    public string DialCode { get; set; }
}
```

### Fields:
- **Id:** The unique identifier for each user.
- **Username:** The username chosen by the user.
- **Email:** The user's email address.
- **Password:** The hashed password of the user.
- **Dob:** Date of birth of the user.
- **Phone:** A complex object representing the user's phone details, including international formats.

## MongoDB Compass

MongoDB Compass is used to visualize and manage the database. Below is a screenshot of the `usersForTask` database as seen in MongoDB Compass:

![MongoCompass](./img4.JPG)

