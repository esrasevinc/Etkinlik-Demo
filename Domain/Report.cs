public class TicketReport
{
    public string ActivityName { get; set; }
    public int TotalTickets { get; set; }
    public List<CustomerAgeInfo> CustomerAgeGroups { get; set; }
}

public class CustomerAgeInfo
{
    public string AgeGroup { get; set; }
    public int Count { get; set; }
}
