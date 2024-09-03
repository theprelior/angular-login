using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using MongoDB.Driver;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using MyApi.Services;

namespace loginApp.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class ValuesController : ControllerBase
    {
        private readonly MongoDBContext _context;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly AuthService _authService;

        public ValuesController(MongoDBContext context, AuthService authService)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<User>();
            _authService = authService;

        }
        // GET: api/values
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/values/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return "value";
        }

        // POST: api/values/submit
        [HttpPost("submit")]
        public IActionResult Submit([FromBody] FormData formData)
        {
            Console.WriteLine($"Kullanıcı Adı: {formData.Username}");
            Console.WriteLine($"Eposta: {formData.Email}");
            Console.WriteLine($"Şifre: {formData.Password}");
            Console.WriteLine($"Doğum Tarihi: {formData.Dob}");
            Console.WriteLine($"GSM Numarası: {formData.Phone}");


            return Ok(new { message = "Form başarıyla alındı!" });
        }

        // POST: api/values/register
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


        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users.Find(_ => true).ToListAsync();
            return Ok(users);
        }

        // POST: api/values/login
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
                var token = _authService.GenerateJwtToken(user); // Remove the await keyword here
                return Ok(new { success = true, token, username = user.Username });
            }
            else
            {
                return Unauthorized(new { success = false, message = "Invalid credentials" });
            }
        }

        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }

    // FormData class
    public class FormData
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Dob { get; set; }
        public string Phone { get; set; }
    }

    // LoginData class
    public class LoginData
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
