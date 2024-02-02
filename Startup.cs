using PowerOfControl.Extensions;
using PowerOfControl.Services;

namespace PowerOfControl;

public class Startup
{
    private readonly IConfiguration _configuration;

    public Startup(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddJWTTokenServices(_configuration);

        services.AddScoped<AccountService>();
        services.AddScoped<TasksService>();
        services.AddScoped<NotesService>();
        services.AddScoped<SettingsService>();

        services.AddCors(options =>
        {
            options.AddPolicy("AllowOrigin", builder =>
            {
                builder.WithOrigins("http://127.0.0.1:5500")
                       .AllowAnyMethod()
                       .AllowAnyHeader()
                       .AllowCredentials(); // Allows the use of cookies in CORS requests
            });
        });
        
        services.AddControllers();

        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
    }

    // Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseAuthentication();

        if (env.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.UseCors("AllowOrigin");

        app.UseRouting();

        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}