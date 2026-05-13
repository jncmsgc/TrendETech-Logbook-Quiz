// Tayo Quiz - Questions Bank v1.0
// Each question has: id, type, section, text, depts[], and type-specific fields

const QUIZ_VERSION = "1.0";
const PASSING_SCORE = 75;

const QUESTIONS = [
    // ===== SECTION A: MULTIPLE CHOICE =====
    {
        id: 1, type: "mc", section: "Multiple Choice",
        text: "How do all inventory requests begin?",
        depts: ["sales","ops","tech"],
        options: [
            "By messaging the #logbook-forum channel directly",
            "By submitting through the HTML Form",
            "By creating a post in the Discord general channel",
            "By submitting through the Logbook AppSheet"
        ],
        answer: 1
    },
    {
        id: 2, type: "mc", section: "Multiple Choice",
        text: "What does the HTML Form submission automatically generate?",
        depts: ["sales","ops","tech"],
        options: [
            "A ticket in the Logbook App",
            "A direct message to the Operations team on Discord",
            "A #logbook-forum thread",
            "A Google Sheets entry"
        ],
        answer: 2
    },
    {
        id: 3, type: "mc", section: "Multiple Choice",
        text: "What is the Core Principle of the logbook system?",
        depts: ["sales","ops","tech"],
        options: [
            "Every request requires Operations approval first",
            "Every request begins digitally via the HTML Form; physical movement follows the digital record",
            "Every request must be coordinated through the Discord forum before any action",
            "Every request requires a photo proof before being submitted"
        ],
        answer: 1
    },
    {
        id: 4, type: "mc", section: "Multiple Choice",
        text: "Which department is considered the final authority with instant approval?",
        depts: ["sales","ops","tech"],
        options: [
            "Sales Department (because they interact with customers)",
            "Management / Admin",
            "Operations",
            "The department that created the request"
        ],
        answer: 2
    },
    {
        id: 5, type: "mc", section: "Multiple Choice",
        text: "Under normal weekday operations (Mon\u2013Sat), who can click Stage 1 assignment buttons?",
        depts: ["sales","ops","tech"],
        options: [
            "The department that submitted the request",
            "Sales and Operations only",
            "Operations only",
            "Any department, as long as they upload photo proof"
        ],
        answer: 2
    },
    {
        id: 6, type: "mc", section: "Multiple Choice",
        text: "What must Sales ALWAYS attach when clicking Sold or Returned?",
        depts: ["sales","ops"],
        options: [
            "A screenshot of the forum thread",
            "The customer's contact information",
            "Photo evidence / proof",
            "A written confirmation from Operations"
        ],
        answer: 2
    },
    {
        id: 7, type: "mc", section: "Multiple Choice",
        text: "Why is the Sales team granted temporary permissions on Sundays?",
        depts: ["sales","ops"],
        options: [
            "Sunday has fewer transactions so less oversight is needed",
            "Operations is unavailable on Sundays",
            "Management allows Sales to work independently on weekends",
            "The automated system handles approvals on Sundays"
        ],
        answer: 1
    },
    {
        id: 8, type: "mc", section: "Multiple Choice",
        text: "On Sundays, which specific Stage 1 button can Sales click on their own?",
        depts: ["sales"],
        options: ["Tech", "Cancelled", "Transferred", "TechTime"],
        answer: 2
    },
    {
        id: 9, type: "mc", section: "Multiple Choice",
        text: "When does Operations approve Sales\u2019 Sunday Stage 2 submissions (Sold/Returned)?",
        depts: ["sales","ops"],
        options: [
            "Immediately via the automated system",
            "Within the same Sunday before end of day",
            "The following day (Monday)",
            "When Operations next reviews the thread, no fixed timeline"
        ],
        answer: 2
    },
    {
        id: 10, type: "mc", section: "Multiple Choice",
        text: "On Sundays, where must Sales place returned items?",
        depts: ["sales"],
        options: [
            "On the Ops desk for Monday processing",
            "Directly back on the shelf where they got it",
            "In the designated box next to the Aircon",
            "In the Tech department\u2019s intake area"
        ],
        answer: 2
    },
    {
        id: 11, type: "mc", section: "Multiple Choice",
        text: "On Sundays, where should Sales get items to borrow?",
        depts: ["sales"],
        options: [
            "From the Return Box (since items are already processed)",
            "From the shelf (new units)",
            "From either the shelf or Return Box, whichever is closer",
            "From the Ops staging area"
        ],
        answer: 1
    },
    {
        id: 12, type: "mc", section: "Multiple Choice",
        text: "When is Sales allowed to take an item from the Return Box instead of the shelf on Sunday?",
        depts: ["sales"],
        options: [
            "When the item in the Return Box matches the requested SKU",
            "When the shelf is too far or inconvenient to access",
            "Only when that item is the very last stock available",
            "When the customer specifically requests a previously returned unit"
        ],
        answer: 2
    },
    {
        id: 14, type: "mc", section: "Multiple Choice",
        text: "Which of the following is PROHIBITED in the logbook system?",
        depts: ["sales","ops","tech"],
        options: [
            "Tagging @Operations for urgent follow-ups",
            "Submitting multiple requests in one HTML Form",
            "Creating manual Discord threads without going through the HTML Form first",
            "Requesting items from a different department\u2019s inventory"
        ],
        answer: 2
    },
    {
        id: 15, type: "mc", section: "Multiple Choice",
        text: "Who is authorized to click the Sold and Returned buttons?",
        depts: ["sales","ops","tech"],
        options: [
            "Only the department that originally requested the item",
            "Sales and Operations only",
            "Operations only (Sales must request Ops to click)",
            "Any department, with photo proof attached"
        ],
        answer: 1
    },
    {
        id: 16, type: "mc", section: "Multiple Choice",
        text: "Where is Sales STRICTLY FORBIDDEN from placing returned items?",
        depts: ["sales","ops"],
        options: [
            "The Return Box",
            "The Ops desk",
            "Directly on the shelf",
            "The designated box near the Aircon"
        ],
        answer: 2
    },
    {
        id: 17, type: "mc", section: "Multiple Choice",
        text: "When should the Emergency Manual Operations protocol be activated?",
        depts: ["sales","ops","tech"],
        options: [
            "Whenever Operations is unavailable (including Sundays)",
            "During high-volume days when the system is slow",
            "Only when the Bot or Dashboard is completely down",
            "When a critical item is needed and the form is taking too long"
        ],
        answer: 2
    },
    {
        id: 18, type: "mc", section: "Multiple Choice",
        text: "During a complete system outage, where should staff create a manual post?",
        depts: ["sales","ops","tech"],
        options: [
            "In the department\u2019s private Discord channel",
            "In #logbook-forum",
            "In the general announcements channel with an @everyone tag",
            "Via direct message to the Operations team lead"
        ],
        answer: 1
    },

    // ===== SECTION B: TRUE OR FALSE =====
    {
        id: 19, type: "tf", section: "True or False",
        text: "Sales can click the Transferred button any day of the week, as long as they upload photo proof.",
        depts: ["sales"],
        answer: false
    },
    {
        id: 20, type: "tf", section: "True or False",
        text: "If a Tech department request contains 10 items and 4 are defective, Tech should return only the 6 working items and keep the 4 for repair.",
        depts: ["tech","ops"],
        answer: false
    },
    {
        id: 21, type: "tf", section: "True or False",
        text: "Operations must still approve Sales\u2019 Stage 1 (Transferred) actions taken on Sundays, but they do it the following day.",
        depts: ["sales","ops"],
        answer: false
    },
    {
        id: 22, type: "tf", section: "True or False",
        text: "On Sundays, if the shelf is empty, Sales may pull the needed item from the Return Box.",
        depts: ["sales"],
        answer: true
    },
    {
        id: 24, type: "tf", section: "True or False",
        text: "Sales can directly coordinate with Tech for item repairs without going through Operations.",
        depts: ["sales","tech"],
        answer: false
    },
    {
        id: 25, type: "tf", section: "True or False",
        text: "During emergency manual operations, the thread title format is: [MANUAL] [Department] - [Name] - [Date].",
        depts: ["sales","ops","tech"],
        answer: false
    },
    {
        id: 26, type: "tf", section: "True or False",
        text: "It is acceptable for Sales to return items directly to the shelf on Sundays since Operations is not available to receive them.",
        depts: ["sales"],
        answer: false
    },

    // ===== SECTION C: FILL IN THE BLANKS =====
    {
        id: 27, type: "fitb", section: "Fill in the Blanks",
        text: 'For Sales: No _____, no movement.',
        depts: ["sales"],
        answer: ["photoproof", "proof", "phot proof", "photo proof", "photo-proof"],
        blankCount: 1
    },
    {
        id: 28, type: "fitb", section: "Fill in the Blanks",
        text: 'Operations must _____ the ticket in the Final Step.',
        depts: ["ops"],
        answer: ["approve", "approved", "confirm", "confirmed"],
        blankCount: 1
    },
    {
        id: 29, type: "fitb", section: "Fill in the Blanks",
        text: 'On Sundays, Sales Stage 1 (Transferred) is _____ immediately, no Ops needed.',
        depts: ["sales"],
        answer: ["approved"],
        blankCount: 1
    },
    {
        id: 30, type: "fitb", section: "Fill in the Blanks",
        text: 'Tech must return the exact _____ quantity received.',
        depts: ["tech","ops"],
        answer: ["total"],
        blankCount: 1
    },
    {
        id: 31, type: "fitb", section: "Fill in the Blanks",
        text: 'For urgent follow-ups, always tag _____ in the forum.',
        depts: ["sales","ops","tech"],
        answer: ["operations", "@operations"],
        blankCount: 1
    },

    // ===== SECTION D: ENUMERATION =====
    {
        id: 32, type: "enum", section: "Enumeration",
        text: "Enumerate the allowed Stage 2 actions for the Sales Department.",
        depts: ["sales","ops"],
        answer: ["sold", "returned", "split"],
        count: 3
    },
    {
        id: 33, type: "enum", section: "Enumeration",
        text: "Enumerate all Stage 1 statuses.",
        depts: ["sales","ops","tech"],
        answer: ["transferred", "tech", "techtime", "cancelled"],
        count: 4
    },
    {
        id: 34, type: "enum", section: "Enumeration",
        text: "Enumerate the 4 main steps of the logbook flow in order.",
        depts: ["sales","ops","tech"],
        answer: ["html form request", "assignment stage", "resolution stage", "final step"],
        count: 4,
        ordered: true
    },
    {
        id: 35, type: "enum", section: "Enumeration",
        text: "Enumerate the Stage 2 buttons available to Operations.",
        depts: ["ops"],
        answer: ["sold", "returned", "repaired", "change status"],
        count: 4
    },

    // ===== SECTION E: IDENTIFICATION =====
    {
        id: 36, type: "id", section: "Identification",
        text: "What is automatically generated when an HTML Form request is submitted?",
        depts: ["sales","ops","tech"],
        answer: ["a #logbook-forum thread", "#logbook-forum thread", "discord thread", "logbook forum channel", "logbook forum thread"]
    },
    {
        id: 37, type: "id", section: "Identification",
        text: "What is the mandatory requirement for ALL Sales actions in the logbook system?",
        depts: ["sales","ops"],
        answer: ["photoproof", "proof", "phot proof", "to show photoproof", "photo proof", "photo evidence"]
    },
    {
        id: 38, type: "id", section: "Identification",
        text: "On what specific day(s) is Sales permitted to pull items directly from the shelf?",
        depts: ["sales"],
        answer: ["sundays", "sunday", "sundays only", "sunday only"]
    },
    {
        id: 39, type: "id", section: "Identification",
        text: 'In emergency manual operations, what exact text do you reply to log that items have been moved/transferred?',
        depts: ["sales","ops","tech"],
        answer: ["--- transferred ---", "--- TRANSFERRED ---", "---transferred---", "---TRANSFERRED---"]
    },

    // ===== SECTION F: CASE / SCENARIO =====
    {
        id: 40, type: "case", section: "Case / Scenario",
        scenario: "The Tech department received 10 laptops from Operations for inspection. After testing, they found that 4 laptops are defective and 6 are working perfectly. What should Tech do?",
        text: "What is the correct action for Tech?",
        depts: ["tech","ops"],
        options: [
            "Return only the 6 working laptops to Ops and file a repair request for the 4",
            "Return all 10 laptops to Ops (6 working + 4 defective) and let Ops create a new ticket for the defective ones",
            "Return all 10 laptops and create a new ticket themselves for the 4 defective ones",
            "Keep all 10 and create a repair ticket \u2014 don\u2019t return until all are fixed"
        ],
        answer: 1
    },
    {
        id: 41, type: "case", section: "Case / Scenario",
        scenario: "It\u2019s a regular Tuesday. A Sales rep just sold a laptop to a customer. The customer paid and left the store. What is the correct sequence of actions for the Sales rep?",
        text: "What should the Sales rep do?",
        depts: ["sales"],
        options: [
            "Click Sold in the system \u2192 Upload photo proof \u2192 Operations approves and closes the ticket",
            "Upload photo proof \u2192 Click Sold \u2192 Operations approves and closes the ticket",
            "Notify Operations \u2192 Ops clicks Sold \u2192 Sales uploads photo proof after",
            "Click Sold \u2192 Go to the shelf to restock \u2192 Upload proof to the thread later"
        ],
        answer: 0
    },
    {
        id: 42, type: "case", section: "Case / Scenario",
        scenario: "It\u2019s Sunday afternoon. A Sales rep needs to borrow a laptop for a customer demo. The shelf has 3 units of that laptop, and there\u2019s also 1 unit sitting in the Return Box. Which unit should the Sales rep take?",
        text: "Where should the Sales rep get the laptop?",
        depts: ["sales","ops"],
        options: [
            "Take from the Return Box \u2014 it\u2019s already been processed and checked",
            "Take from the shelf \u2014 always use new stock first, Return Box only if it\u2019s the last stock",
            "Take from either \u2014 both are available inventory on Sundays",
            "Don\u2019t take any \u2014 message Operations first and wait for Monday approval"
        ],
        answer: 1
    }
];

// Section definitions for rendering
const SECTIONS = [
    { key: "Multiple Choice", icon: "\ud83d\udcdd", color: "blue" },
    { key: "True or False", icon: "\u2705", color: "green" },
    { key: "Fill in the Blanks", icon: "\u270f\ufe0f", color: "amber" },
    { key: "Enumeration", icon: "\ud83d\udccb", color: "purple" },
    { key: "Identification", icon: "\ud83d\udd0d", color: "cyan" },
    { key: "Case / Scenario", icon: "\ud83d\udcd6", color: "red" }
];
