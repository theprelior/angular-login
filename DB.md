
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

Here are the specific sections in your `ValuesController` where MongoDB is used:

---

### MongoDB Usage in `ValuesController`

In the `ValuesController`, MongoDB is utilized primarily to interact with the `users` collection for user registration, login, and retrieval of user data. Below are the key methods where MongoDB is accessed:

#### 1. **Registering a User (`Register` method)**

In the `Register` method, MongoDB is used to:
- Check if the username or email is already taken using the `IsUsernameTakenAsync` and `IsEmailTakenAsync` methods from `MongoDBContext`.
- Insert a new user into the `users` collection.

```csharp
[HttpPost("register")]
public async Task<IActionResult> Register([FromBody] User user)
{
    if (user == null)
    {
        return BadRequest(new { message = "Invalid user data." });
    }

    Console.WriteLine($"Received User: {user.Username}, {user.Email}, {user.Password}, {user.Dob}, {user.Phone.Number}");
    
    if (string.IsNullOrEmpty(user.Username) ||
        string.IsNullOrEmpty(user.Email) ||
        string.IsNullOrEmpty(user.Password) ||
        string.IsNullOrEmpty(user.Dob))
    {
        return BadRequest(new { message = "All fields are required." });
    }

    if (await _context.IsUsernameTakenAsync(user.Username))
    {
        return BadRequest(new { message = "Username is already taken." });
    }

    if (await _context.IsEmailTakenAsync(user.Email))
    {
        return BadRequest(new { message = "Email is already taken." });
    }

    user.Password = _passwordHasher.HashPassword(user, user.Password); // Password encrypting
    await _context.Users.InsertOneAsync(user);
    return Ok(new { message = "User registered successfully!" });
}
```

#### 2. **Retrieving All Users (`GetUsers` method)**

In the `GetUsers` method, MongoDB is used to:
- Fetch all users from the `users` collection.

```csharp
[HttpGet("users")]
public async Task<IActionResult> GetUsers()
{
    var users = await _context.Users.Find(_ => true).ToListAsync();
    return Ok(users);
}
```

#### 3. **User Login (`Login` method)**

In the `Login` method, MongoDB is used to:
- Find a user by their username in the `users` collection.
- Verify the hashed password for authentication.

```csharp
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginData loginData)
{
    var user = await _context.Users.Find(u => u.Username == loginData.Username).FirstOrDefaultAsync();

    if (user == null)
    {
        return Unauthorized(new { success = false, message = "Invalid credentials" });
    }

    var result = _passwordHasher.VerifyHashedPassword(user, user.Password, loginData.Password);

    if (result == PasswordVerificationResult.Success)
    {
        var token = _authService.GenerateJwtToken(user);
        return Ok(new { success = true, token, username = user.Username });
    }
    else
    {
        return Unauthorized(new { success = false, message = "Invalid credentials" });
    }
}
```

#### 4. **Dependency Injection in the Constructor**

MongoDB is integrated into the controller through dependency injection of the `MongoDBContext` in the constructor:

```csharp
private readonly MongoDBContext _context;

public ValuesController(MongoDBContext context, AuthService authService)
{
    _context = context;
    _passwordHasher = new PasswordHasher<User>();
    _authService = authService;
}
```

This context provides access to the `users` collection and methods for interacting with the database.

