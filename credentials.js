/*
* User-specific configuration
* IMPORTANT NOTES:
*   Please ensure you do not interchange your username and password.
*   Your username is the longer value: 36 digits, including hyphens
*   Your password is the smaller value: 12 characters
*/

exports.conversationWorkspaceId = '76ceb03d-f023-444c-8d7b-79d6bb48b461'; // replace with the workspace identifier of your conversation

// Create the credentials object for export
exports.credentials = {};

// Watson Assistant
// https://www.ibm.com/watson/ai-assistant/
exports.credentials.conversation = {
	version: '2019-02-28',
  	iam_apikey: 'uYf0u76pFoseeT5rGWAfM_TFCY2mpq7WCm4vm6p-BznS',
  	url: 'https://gateway-fra.watsonplatform.net/assistant/api'
};
