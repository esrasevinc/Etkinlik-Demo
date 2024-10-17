using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using Persistence;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly DataContext _context;

    public ReportsController(DataContext context)
    {
        _context = context;
    }

    [HttpGet("excel/{activityId}")]
    public IActionResult GenerateReport(Guid activityId)
    {
        var tickets = _context.Tickets
            .Where(t => t.ActivityId == activityId)
            .Include(t => t.Customer)
            .ToList();

        if (!tickets.Any())
        {
            return NotFound("No tickets found for this activity.");
        }

 
        var report = new TicketReport
        {
            ActivityName = tickets.First().Activity.Name,
            TotalTickets = tickets.Count,
            CustomerAgeGroups = GetCustomerAgeGroups(tickets)
        };

   
        var stream = new MemoryStream();
        using (var package = new ExcelPackage(stream))
        {
            var worksheet = package.Workbook.Worksheets.Add("Ticket Report");

            worksheet.Cells[1, 1].Value = "Etkinlik";
            worksheet.Cells[1, 2].Value = "Toplam Bilet Sayısı";
            worksheet.Cells[1, 3].Value = "Yaş Grubu";
            worksheet.Cells[1, 4].Value = "Sayı";

            worksheet.Cells[2, 1].Value = report.ActivityName;
            worksheet.Cells[2, 2].Value = report.TotalTickets;

   
            int row = 2;
            foreach (var ageGroup in report.CustomerAgeGroups)
            {
                worksheet.Cells[row, 3].Value = ageGroup.AgeGroup;
                worksheet.Cells[row, 4].Value = ageGroup.Count;
                row++;
            }

            package.Save();
        }

        stream.Position = 0;
        string excelName = $"{report.ActivityName}_Report_{DateTime.Now.ToString("yyyyMMddHHmmss")}.xlsx";
        return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelName);
    }

    private List<CustomerAgeInfo> GetCustomerAgeGroups(List<Ticket> tickets)
    {
        var ageGroups = new List<CustomerAgeInfo>
        {
            new CustomerAgeInfo { AgeGroup = "0-17", Count = 0 },
            new CustomerAgeInfo { AgeGroup = "18-25", Count = 0 },
            new CustomerAgeInfo { AgeGroup = "26-35", Count = 0 },
            new CustomerAgeInfo { AgeGroup = "36-45", Count = 0 },
            new CustomerAgeInfo { AgeGroup = "46-55", Count = 0 },
            new CustomerAgeInfo { AgeGroup = "56+", Count = 0 }
        };

        foreach (var ticket in tickets)
        {
            var age = CalculateAge(ticket.Customer.BirthDate);
            if (age < 18)
                ageGroups[0].Count++;
            else if (age >= 18 && age <= 25)
                ageGroups[1].Count++;
            else if (age >= 26 && age <= 35)
                ageGroups[2].Count++;
            else if (age >= 36 && age <= 45)
                ageGroups[3].Count++;
            else if (age >= 46 && age <= 55)
                ageGroups[4].Count++;
            else
                ageGroups[5].Count++;
        }

        return ageGroups;
    }

    private int CalculateAge(DateTime birthDate)
    {
        var today = DateTime.Today;
        var age = today.Year - birthDate.Year;
        if (birthDate.Date > today.AddYears(-age)) age--;
        return age;
    }
}
