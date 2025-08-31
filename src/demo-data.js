// demo-data.js - Sample data to showcase the beautiful interface
export const demoTabs = [
  {
    title: "Sales Data",
    rows: 150,
    cols: 26
  },
  {
    title: "Inventory",
    rows: 89,
    cols: 26
  },
  {
    title: "Customer Info",
    rows: 234,
    cols: 26
  },
  {
    title: "Analytics",
    rows: 67,
    cols: 26
  }
];

export const demoSalesData = [
  ["Product", "Category", "Q1 Sales", "Q2 Sales", "Q3 Sales", "Q4 Sales", "Total", "Growth %", "Region", "Manager", "Status"],
  ["Laptop Pro", "Electronics", "125000", "138000", "142000", "156000", "561000", "12.4%", "North", "Sarah Johnson", "Active"],
  ["Wireless Mouse", "Accessories", "45000", "52000", "48000", "61000", "206000", "35.6%", "South", "Mike Chen", "Active"],
  ["4K Monitor", "Electronics", "89000", "95000", "102000", "118000", "404000", "32.6%", "East", "Emily Davis", "Active"],
  ["Mechanical Keyboard", "Accessories", "67000", "72000", "78000", "85000", "302000", "26.9%", "West", "Alex Rodriguez", "Active"],
  ["Gaming Headset", "Audio", "34000", "38000", "42000", "48000", "162000", "41.2%", "North", "David Kim", "Active"],
  ["USB-C Hub", "Accessories", "28000", "32000", "35000", "41000", "136000", "46.4%", "South", "Lisa Wang", "Active"],
  ["Bluetooth Speaker", "Audio", "56000", "61000", "65000", "72000", "254000", "28.6%", "East", "Tom Wilson", "Active"],
  ["Webcam HD", "Video", "42000", "48000", "52000", "58000", "200000", "38.1%", "West", "Rachel Green", "Active"],
  ["External SSD", "Storage", "78000", "85000", "92000", "105000", "360000", "34.6%", "North", "Chris Lee", "Active"],
  ["Wireless Charger", "Accessories", "31000", "35000", "38000", "44000", "148000", "41.9%", "South", "Maria Garcia", "Active"],
  ["Smart Watch", "Wearables", "95000", "108000", "115000", "128000", "446000", "34.7%", "East", "James Brown", "Active"],
  ["Portable Speaker", "Audio", "38000", "42000", "46000", "52000", "178000", "36.8%", "West", "Anna Taylor", "Active"],
  ["Tablet Stand", "Accessories", "22000", "25000", "27000", "31000", "105000", "40.9%", "North", "Kevin Park", "Active"],
  ["Wireless Earbuds", "Audio", "67000", "74000", "81000", "89000", "311000", "32.8%", "South", "Jennifer White", "Active"],
  ["HDMI Cable", "Cables", "15000", "17000", "18000", "21000", "71000", "40.0%", "East", "Robert Clark", "Active"],
  ["Power Bank", "Accessories", "45000", "50000", "54000", "60000", "209000", "33.3%", "West", "Amanda Hall", "Active"],
  ["Desk Lamp", "Furniture", "28000", "32000", "35000", "40000", "135000", "42.9%", "North", "Daniel Miller", "Active"],
  ["Phone Case", "Accessories", "34000", "38000", "41000", "47000", "160000", "38.2%", "South", "Sophie Turner", "Active"],
  ["Laptop Sleeve", "Accessories", "19000", "22000", "24000", "28000", "93000", "47.4%", "East", "Ryan Adams", "Active"],
  ["Monitor Arm", "Furniture", "32000", "36000", "39000", "44000", "151000", "37.5%", "West", "Emma Thompson", "Active"]
];

export const demoInventoryData = [
  ["SKU", "Product Name", "Category", "Current Stock", "Min Stock", "Max Stock", "Unit Cost", "Total Value", "Supplier", "Last Updated", "Status"],
  ["LAP-001", "Laptop Pro 15\"", "Electronics", "45", "10", "100", "899.99", "40499.55", "TechCorp", "2024-01-15", "In Stock"],
  ["MOU-002", "Wireless Mouse", "Accessories", "128", "25", "200", "29.99", "3838.72", "AccessPro", "2024-01-14", "In Stock"],
  ["MON-003", "4K Monitor 27\"", "Electronics", "23", "5", "50", "299.99", "6899.77", "DisplayTech", "2024-01-15", "Low Stock"],
  ["KEY-004", "Mechanical Keyboard", "Accessories", "67", "15", "120", "89.99", "6029.33", "KeyCorp", "2024-01-13", "In Stock"],
  ["HEA-005", "Gaming Headset", "Audio", "89", "20", "150", "79.99", "7119.11", "AudioPro", "2024-01-14", "In Stock"],
  ["HUB-006", "USB-C Hub", "Accessories", "156", "30", "250", "24.99", "3898.44", "ConnectTech", "2024-01-12", "In Stock"],
  ["SPK-007", "Bluetooth Speaker", "Audio", "34", "8", "80", "59.99", "2039.66", "SoundCorp", "2024-01-15", "Low Stock"],
  ["CAM-008", "Webcam HD", "Video", "78", "15", "100", "39.99", "3119.22", "VideoTech", "2024-01-13", "In Stock"],
  ["SSD-009", "External SSD 1TB", "Storage", "12", "3", "25", "129.99", "1559.88", "StorageCorp", "2024-01-15", "Critical"],
  ["CHG-010", "Wireless Charger", "Accessories", "45", "10", "80", "19.99", "899.55", "PowerTech", "2024-01-14", "In Stock"],
  ["WAT-011", "Smart Watch", "Wearables", "23", "5", "50", "199.99", "4599.77", "WearableCorp", "2024-01-15", "Low Stock"],
  ["SPK-012", "Portable Speaker", "Audio", "67", "15", "100", "49.99", "3349.33", "AudioPro", "2024-01-13", "In Stock"],
  ["STA-013", "Tablet Stand", "Accessories", "89", "20", "150", "14.99", "1334.11", "StandCorp", "2024-01-14", "In Stock"],
  ["EAR-014", "Wireless Earbuds", "Audio", "34", "8", "60", "89.99", "3059.66", "AudioPro", "2024-01-15", "Low Stock"],
  ["CAB-015", "HDMI Cable 2m", "Cables", "234", "50", "300", "8.99", "2103.66", "CableCorp", "2024-01-12", "In Stock"],
  ["PWR-016", "Power Bank 20K", "Accessories", "56", "12", "100", "39.99", "2239.44", "PowerTech", "2024-01-13", "In Stock"],
  ["LMP-017", "Desk Lamp LED", "Furniture", "78", "15", "120", "24.99", "1949.22", "LightCorp", "2024-01-14", "In Stock"],
  ["CAS-018", "Phone Case", "Accessories", "145", "30", "200", "12.99", "1883.55", "CaseCorp", "2024-01-12", "In Stock"],
  ["SLE-019", "Laptop Sleeve", "Accessories", "67", "15", "100", "19.99", "1339.33", "ProtectCorp", "2024-01-13", "In Stock"],
  ["ARM-020", "Monitor Arm", "Furniture", "23", "5", "40", "34.99", "804.77", "MountCorp", "2024-01-15", "Low Stock"]
];

export const demoCustomerData = [
  ["Customer ID", "Name", "Email", "Phone", "Company", "Industry", "Total Spent", "Last Purchase", "Status", "Sales Rep", "Notes"],
  ["CUST-001", "John Smith", "john.smith@techcorp.com", "+1-555-0101", "TechCorp Inc", "Technology", "$12,450", "2024-01-10", "Active", "Sarah Johnson", "Enterprise client"],
  ["CUST-002", "Emily Davis", "emily.davis@innovate.com", "+1-555-0102", "Innovate Solutions", "Consulting", "$8,920", "2024-01-12", "Active", "Mike Chen", "Regular customer"],
  ["CUST-003", "Michael Brown", "michael.brown@startup.io", "+1-555-0103", "Startup.io", "SaaS", "$5,670", "2024-01-08", "Active", "Emily Davis", "Growing startup"],
  ["CUST-004", "Lisa Wang", "lisa.wang@globaltech.com", "+1-555-0104", "GlobalTech", "Manufacturing", "$23,100", "2024-01-15", "Active", "Alex Rodriguez", "Major account"],
  ["CUST-005", "David Kim", "david.kim@creative.com", "+1-555-0105", "Creative Agency", "Marketing", "$6,890", "2024-01-11", "Active", "David Kim", "Design team"],
  ["CUST-006", "Rachel Green", "rachel.green@healthcare.com", "+1-555-0106", "Healthcare Plus", "Healthcare", "$15,230", "2024-01-14", "Active", "Tom Wilson", "Medical equipment"],
  ["CUST-007", "Chris Lee", "chris.lee@finance.com", "+1-555-0107", "Finance Corp", "Financial", "$18,750", "2024-01-09", "Active", "Rachel Green", "Banking sector"],
  ["CUST-008", "Maria Garcia", "maria.garcia@retail.com", "+1-555-0108", "Retail Chain", "Retail", "$9,450", "2024-01-13", "Active", "Chris Lee", "Store network"],
  ["CUST-009", "James Brown", "james.brown@education.edu", "+1-555-0109", "University", "Education", "$7,890", "2024-01-07", "Active", "Maria Garcia", "Academic institution"],
  ["CUST-010", "Anna Taylor", "anna.taylor@legal.com", "+1-555-0110", "Legal Partners", "Legal", "$4,560", "2024-01-12", "Active", "James Brown", "Law firm"],
  ["CUST-011", "Kevin Park", "kevin.park@media.com", "+1-555-0111", "Media Group", "Media", "$11,230", "2024-01-15", "Active", "Anna Taylor", "Content creation"],
  ["CUST-012", "Jennifer White", "jennifer.white@nonprofit.org", "+1-555-0112", "NonProfit Org", "Non-Profit", "$3,450", "2024-01-10", "Active", "Kevin Park", "Charity organization"],
  ["CUST-013", "Robert Clark", "robert.clark@construction.com", "+1-555-0113", "BuildCorp", "Construction", "$16,780", "2024-01-11", "Active", "Jennifer White", "Construction firm"],
  ["CUST-014", "Amanda Hall", "amanda.hall@hospitality.com", "+1-555-0114", "Hotel Chain", "Hospitality", "$8,920", "2024-01-14", "Active", "Robert Clark", "Hotel management"],
  ["CUST-015", "Daniel Miller", "daniel.miller@automotive.com", "+1-555-0115", "AutoTech", "Automotive", "$12,340", "2024-01-08", "Active", "Amanda Hall", "Car manufacturer"],
  ["CUST-016", "Sophie Turner", "sophie.turner@fashion.com", "+1-555-0116", "Fashion House", "Fashion", "$6,780", "2024-01-13", "Active", "Daniel Miller", "Clothing brand"],
  ["CUST-017", "Ryan Adams", "ryan.adams@food.com", "+1-555-0117", "Food Services", "Food & Beverage", "$9,120", "2024-01-12", "Active", "Sophie Turner", "Restaurant chain"],
  ["CUST-018", "Emma Thompson", "emma.thompson@energy.com", "+1-555-0118", "Energy Corp", "Energy", "$21,450", "2024-01-15", "Active", "Ryan Adams", "Power company"],
  ["CUST-019", "Tom Wilson", "tom.wilson@transport.com", "+1-555-0119", "Transport Ltd", "Transportation", "$7,890", "2024-01-09", "Active", "Emma Thompson", "Logistics company"],
  ["CUST-020", "Alex Rodriguez", "alex.rodriguez@realestate.com", "+1-555-0120", "Real Estate Co", "Real Estate", "$14,670", "2024-01-11", "Active", "Tom Wilson", "Property management"]
];
