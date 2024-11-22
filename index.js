const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS for all origins
app.use(cors());

// Pagination API
app.get("/events", (req, res) => {
  try {
    // Read JSON data from the file
    const eventsData = JSON.parse(fs.readFileSync("data.json", "utf-8"));

    const pageNumber = parseInt(req.query.page_number) || 0; // Default to page 0
    const pageSize = parseInt(req.query.page_size) || 25;   // Default to 25 items per page

    const totalElements = eventsData.length;               // Total number of items
    const totalPages = Math.ceil(totalElements / pageSize); // Total pages based on page size

    const startIndex = pageNumber * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalElements);

    const paginatedData = eventsData.slice(startIndex, endIndex);

    res.json({
      total_elements: totalElements,
      total_pages: totalPages,
      events: paginatedData,
    });
  } catch (error) {
    console.error("Error reading data.json:", error);
    res.status(500).json({ error: "Unable to read data." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
