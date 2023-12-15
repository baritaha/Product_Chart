using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.ComponentModel.DataAnnotations;
using System.Data;

namespace WebApplication1.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class CartAppController : ControllerBase
  {
    private IConfiguration _configuration;
    public CartAppController(IConfiguration configuration)
    {
      _configuration = configuration;
    }
    [HttpGet]
    [Route("GetProduct")]
    public JsonResult GetProduct()
    {
      string query = "select * from TableRegister ";
      DataTable table = new DataTable();
      string sqlDatasource = _configuration.GetConnectionString("CartDBCon");
      SqlDataReader myReader;
      using (SqlConnection myCon = new SqlConnection(sqlDatasource))
      {
        myCon.Open();
        using (SqlCommand myCommand = new SqlCommand(query, myCon))
        {
          myReader = myCommand.ExecuteReader();
          table.Load(myReader);
          myReader.Close();
          myCon.Close();
        }
      }
      return new JsonResult(table);
    }
    [HttpPost]
    [Route("Registing")]
    public JsonResult Registing([FromForm] string username, [FromForm] string password, [FromForm] string Cpassword)
    {
      if (password != Cpassword)
      {
        return new JsonResult("Passwords don't match");
      }
      string query = "INSERT INTO TableRegister (username, password,Cpassword) VALUES (@username, @password,@Cpassword)";
      DataTable table = new DataTable();
      string sqlDatasource = _configuration.GetConnectionString("CartDBCon");
      SqlDataReader myReader;
      using (SqlConnection myCon = new SqlConnection(sqlDatasource))
      {
        myCon.Open();
        using (SqlCommand myCommand = new SqlCommand(query, myCon))
        {
          myCommand.Parameters.AddWithValue("username", username);
          myCommand.Parameters.AddWithValue("password", password);
          myCommand.Parameters.AddWithValue("Cpassword", Cpassword);
          myReader = myCommand.ExecuteReader();
          table.Load(myReader);
          myReader.Close();
          myCon.Close();
        }
      }
      return new JsonResult("Added Successfully");
    }
    [HttpPost]
    [Route("Login")]
    public JsonResult Login([FromForm] string username, [FromForm] string password)
    {
      string query = "SELECT COUNT(*) FROM TableRegister WHERE username = @username AND password = @password";
      int result = 0;
      string sqlDatasource = _configuration.GetConnectionString("CartDBCon");

      using (SqlConnection myCon = new SqlConnection(sqlDatasource))
      {
        myCon.Open();
        using (SqlCommand myCommand = new SqlCommand(query, myCon))
        {
          myCommand.Parameters.AddWithValue("username", username);
          myCommand.Parameters.AddWithValue("password", password);
          result = (int)myCommand.ExecuteScalar();
        }
      }

      return new JsonResult(new { isRegistered = result > 0 });
    }

    [HttpPost]
    [Route("AddProducts")]
    public IActionResult AddProducts([FromForm] string productName, [FromForm] string type, [FromForm] decimal Price, [FromForm] int Quantity, [FromForm] int userId)
    {
      if (ModelState.IsValid)
      {
        string connectionString = _configuration.GetConnectionString("CartDBCon");
        using SqlConnection connection = new SqlConnection(connectionString);

        connection.Open();
        using SqlCommand command = connection.CreateCommand();
        command.CommandType = CommandType.Text;

        command.CommandText = "INSERT INTO ProductAdd (productName, type, Price, Quantity,userId,orderDate) " +
                              "VALUES (@productName, @type, @Price, @Quantity,@userId,@orderDate)";

        command.Parameters.AddWithValue("@productName", productName);
        command.Parameters.AddWithValue("@type", type);
        command.Parameters.AddWithValue("@Price", Price);
        command.Parameters.AddWithValue("@Quantity", Quantity);
        command.Parameters.AddWithValue("@userId", userId);
        command.Parameters.AddWithValue("@orderDate", DateTime.Now);

        int rowsAffected = command.ExecuteNonQuery();

        if (rowsAffected > 0)
        {
          return Ok(new { isInserted = true });
        }
        else
        {
          return BadRequest("Failed to insert product.");
        }
      }
      else
      {
        return BadRequest(ModelState);
      }
    }
    [HttpGet]
    [Route("GetPastOrders")]
    public IActionResult GetPastOrders(int userId)
    {
      Console.WriteLine("the userId is " + userId);
      try
      {
        string connectionString = _configuration.GetConnectionString("CartDBCon");
        using SqlConnection connection = new SqlConnection(connectionString);
        connection.Open();

        string query = "SELECT productName, type, Price, Quantity, orderDate,userId FROM ProductAdd WHERE userId = @userId ORDER BY orderDate DESC";
        using SqlCommand command = new SqlCommand(query, connection);
        command.Parameters.AddWithValue("@userId", userId);

        List<Dictionary<string, object>> pastOrders = new List<Dictionary<string, object>>();
        using SqlDataReader reader = command.ExecuteReader();
        while (reader.Read())
        {
          Dictionary<string, object> order = new Dictionary<string, object>
            {
                { "productName", reader.GetString(0) },
                { "type", reader.GetString(1) },
                { "Price", reader.GetDecimal(2) },
                { "Quantity", reader.GetInt32(3) },
                { "orderDate", reader.GetDateTime(4) },
                { "userId", reader.GetInt32(5) }
            };

        
          var existingOrder = pastOrders.FirstOrDefault(o => o["productName"]?.ToString() == order["productName"]?.ToString());
          if (existingOrder != null)
          {
            existingOrder["Quantity"] = Convert.ToInt32(existingOrder["Quantity"]) + Convert.ToInt32(order["Quantity"]);
          }
          else
          {
            pastOrders.Add(order);
          }
        }

        
        foreach (var order in pastOrders)
        {
          Console.WriteLine($"productName: {order["productName"]}, type: {order["type"]}, Price: {order["Price"]}, Quantity: {order["Quantity"]}");
        }

       
        return Ok(pastOrders);
      }
      catch (Exception ex)
      {
        return BadRequest($"Error fetching past orders: {ex.Message}");
      }
    }

    [HttpGet]
    [Route("GetUserId")]
    public IActionResult GetUserId(string username)
    {
      try
      {
        string connectionString = _configuration.GetConnectionString("CartDBCon");
        using SqlConnection connection = new SqlConnection(connectionString);
        connection.Open();

        string query = "SELECT id FROM TableRegister WHERE username = @username";
        using SqlCommand command = new SqlCommand(query, connection);
        command.Parameters.AddWithValue("@username", username);

        object result = command.ExecuteScalar();
        if (result != null)
        {
          int userId = Convert.ToInt32(result);
          return Ok(new { userId });
        }
        else
        {
          return NotFound();
        }
      }
      catch (Exception ex)
      {
        return BadRequest($"Error getting user id: {ex.Message}");
      }
    }

  }
}

  

