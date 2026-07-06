# VoiceAI
Building a landing page, booking page, for a client, for booking appointments using an outbound voice AI agent with the help of Retell AI, gohighlevel CRM and n8n.
Voices used : ElevenLabs, OpenAI

### REQUIREMENTS : 
1. Private integration token (GHL)
2. Phone number to be purchased and given to Retell AI agent to make calls.

# OUTPUT (RETELL AI + N8N + GHL CRM)
<img width="1366" height="661" alt="n8n-1" src="https://github.com/user-attachments/assets/d5dd7dde-8197-4e9a-841e-ddf113471800" />

**POSTCALL ANALYSIS**
<img width="1130" height="527" alt="image" src="https://github.com/user-attachments/assets/7b3dacbe-4123-4ffd-8fb5-2aee109e6e11" />

**APPOINTMENT BOOKED IN CALENDAR**
<img width="2048" height="922" alt="ghl-3" src="https://github.com/user-attachments/assets/24162715-b367-4d74-bd23-91b6e54cf89d" />

**FUNNEL**
<img width="1366" height="731" alt="GHL-1" src="https://github.com/user-attachments/assets/adb790a0-6b57-4377-9532-7a245ea50543" />






## GHL (CRM) : 
1. The first step : 
  First a user submits a survey on the landing page, then the "survey submitted" trigger will be activated, a contact will be created using the Create contact action, (based on info submitted in survey) , then   we will add a contact tag, let's name it "newlead"

2. Now in another workflow 
  We add contact tag = newlead as a trigger. 
  When this trigger is activated it goes to the condition, and if workflow trigger is the contact tag, then all below actions will be executed. Here I added a wait node of 5 mins.

3. within these 5 mins, if the user books an appointment, then another workflow (which has the Customer booked appointment will be triggered and it will remove itself from the current workflow.(We need to add     this as an action))

   If the user doesn't book an appointment, Then a call will be made to Retell ai via the webhook which actively sends data to the n8n workflow.
   The n8n workflow will be listening, as soon as it receives the data it will make a call request to the Retell api  (refer api docs of create phone call endpoint )

4. Then the agent will make a call to the user, and once it is done, we will go to the second stage of the pipeline which is "Contacted". 
    Since the agent has contacted the user. 
    Next we will update the contact fields.

5. If Call status = no-answer,
   Times Called = 1, then the trigger with (Call status = no-answer will be triggered).

6. So for creating a multi prompt agent, we have to follow a prompt tree structure, like this, and the prompt has to be passed in markdown format, it is the format the agent understands.
   When you capitalise a text, it tells the agent that it is very important.

   <img width="1042" height="528" alt="image" src="https://github.com/user-attachments/assets/756736b8-79a4-4d98-af1e-9733b6120e09" />

## N8N
<img width="1366" height="768" alt="n8n-1 1" src="https://github.com/user-attachments/assets/f5f0513a-83b1-48ac-8843-0c6706469a3a" />
<img width="1366" height="768" alt="n8n-2" src="https://github.com/user-attachments/assets/1a54bc76-cb5b-47fb-a9ec-98ea1ba7b851" />
<img width="1366" height="768" alt="n8n-3" src="https://github.com/user-attachments/assets/a3913423-aa60-4431-9642-7fbc273d074b" />









## CHALLENGES
  Done with checking availability, booking appointment needs oauth access token or private integration token which is not available for a sub account, so we need that to get the http response.
  "Invalid jwt error" because I need a private integration token. (It's under agency level)
