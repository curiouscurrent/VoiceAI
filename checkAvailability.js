// Get dynamic inputs
const reqDate = $('Webhook').first().json.body.args.startDate; 
const reqTime = $('Webhook').first().json.body.args.startTime; // already in AM/PM
const availslots = $input.first().json[reqDate]?.slots || []; 

// Convert ISO slot to AM/PM
function simpleAMPM(slot) {
    const hour = parseInt(slot.slice(11, 13));
    const minutes = slot.slice(14, 16);
    const ampm = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Convert all slots to AM/PM
let formattedSlots = availslots.map(simpleAMPM);

// Split slots into morning (AM) and afternoon (PM)
let morningSlots = formattedSlots.filter(s => s.includes("AM"));
let afternoonSlots = formattedSlots.filter(s => s.includes("PM"));

// Helper to pick random slots
function pickRandomSlots(arr, n) {
    const shuffled = arr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

// Agent response flow
let agentResponse = '';
let slotMatched = false;

// Check if requested time matches
if (formattedSlots.includes(reqTime)) {
    agentResponse = `Perfect! I have ${reqTime} available that day. Would you like me to book an appointment for you?`;
    slotMatched = true;
} else {
    // Initialize preference arrays
    let morningPref = morningSlots.slice();
    let afternoonPref = afternoonSlots.slice();
    let currentPref = morningPref.length > 0 ? "AM" : afternoonPref.length > 0 ? "PM" : null;

    // Loop until a slot is matched or all slots are exhausted
    while (!slotMatched) {
        if (!currentPref) {
            agentResponse = "No available slots left on this date. Please pick another date.";
            break;
        }

        // Determine which array to suggest from
        let prefSlots = currentPref === "AM" ? morningPref : afternoonPref;

        if (prefSlots.length === 0) {
            // Switch to the other preference if current is exhausted
            if (currentPref === "AM" && afternoonPref.length > 0) {
                currentPref = "PM";
                prefSlots = afternoonPref;
            } else if (currentPref === "PM" && morningPref.length > 0) {
                currentPref = "AM";
                prefSlots = morningPref;
            } else {
                // Both preferences exhausted
                agentResponse = "No available slots left on this date. Please pick another date.";
                break;
            }
        }

        // Pick 2 random slots from current preference
        const suggested = pickRandomSlots(prefSlots, 2);
        agentResponse = `Sorry, that time isn't available. Here are some ${currentPref === "AM" ? "morning" : "afternoon"} slots: ${suggested.join(", ")}. Would you like one of these?`;

        // Remove suggested slots from the preference array to avoid repetition
        if (currentPref === "AM") morningPref = morningPref.filter(s => !suggested.includes(s));
        else afternoonPref = afternoonPref.filter(s => !suggested.includes(s));

        // In a real interactive flow, here you would wait for user selection.
        // For simulation, break after first batch; loop continues on next user input
        break;
    }
}

// Return JSON
return {
    success: true,
    agentResponse,
    availableSlots: formattedSlots
};
