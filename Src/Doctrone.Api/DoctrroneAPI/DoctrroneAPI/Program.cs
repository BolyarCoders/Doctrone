using System.Net.Http.Headers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()   // Or use .WithOrigins("https://yourfrontend.com") for specific domains
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var client = new HttpClient();
client.BaseAddress = new Uri("https://vhssvvlsgoprgizbckea.supabase.co");
client.DefaultRequestHeaders.Authorization =
    new AuthenticationHeaderValue("Bearer", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoc3N2dmxzZ29wcmdpemJja2VhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDczODE3MiwiZXhwIjoyMDc2MzE0MTcyfQ.hi1H_auhhhtrN7H2szPkQBmB5Zl5WV0Wf2u0QsIhaP0");
client.DefaultRequestHeaders.Add("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoc3N2dmxzZ29wcmdpemJja2VhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDczODE3MiwiZXhwIjoyMDc2MzE0MTcyfQ.hi1H_auhhhtrN7H2szPkQBmB5Zl5WV0Wf2u0QsIhaP0");


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
