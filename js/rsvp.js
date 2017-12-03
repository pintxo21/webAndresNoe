$(document).ready(function(){
	
	'use strict';


          // Client ID and API key from the Developer Console
          var CLIENT_ID = '912489645483-kb7665po0fhrubt2msokb5e79bu70hl6.apps.googleusercontent.com';

          // Array of API discovery doc URLs for APIs used by the quickstart
          var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

          // Authorization scopes required by the API; multiple scopes can be
          // included, separated by spaces.
          var SCOPES = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send';

          /**
           *  On load, called to load the auth2 library and API client library.
           */
          function handleClientLoad() {
            gapi.load('client:auth2', initClient);
          }

          /**
           *  Initializes the API client library and sets up sign-in state
           *  listeners.
           */
          function initClient() {
            gapi.client.init({
              discoveryDocs: DISCOVERY_DOCS,
              clientId: CLIENT_ID,
              scope: SCOPES
            }).then(function () {
              // Listen for sign-in state changes.
              gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

              // Handle the initial sign-in state.
              updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
              authorizeButton.onclick = handleAuthClick;
              signoutButton.onclick = handleSignoutClick;
            });
          }

          /**
           *  Called when the signed in status changes, to update the UI
           *  appropriately. After a sign-in, the API is called.
           */
          function updateSigninStatus(isSignedIn) {
            if (isSignedIn) {
              authorizeButton.style.display = 'none';
              signoutButton.style.display = 'block';
              listLabels();
            } else {
              authorizeButton.style.display = 'block';
              signoutButton.style.display = 'none';
            }
          }

          /**
           *  Sign in the user upon button click.
           */
          function handleAuthClick(event) {
            gapi.auth2.getAuthInstance().signIn();
          }

          /**
           *  Sign out the user upon button click.
           */
          function handleSignoutClick(event) {
            gapi.auth2.getAuthInstance().signOut();
          }

          /**
           * Append a pre element to the body containing the given message
           * as its text node. Used to display the results of the API call.
           *
           * @param {string} message Text to be placed in pre element.
           */
          function appendPre(message) {
            var pre = document.getElementById('content');
            var textContent = document.createTextNode(message + '\n');
            pre.appendChild(textContent);
          }

          function sendEmail()
          {
            $('#send-button').addClass('disabled');

            sendMessage(
              {
                'To': $('#compose-to').val(),
                'Subject': $('#compose-subject').val()
              },
              $('#compose-message').val(),
              composeTidy
            );

            return false;
          }

          function composeTidy()
          {
            $('#compose-modal').modal('hide');

            $('#compose-to').val('');
            $('#compose-subject').val('');
            $('#compose-message').val('');

            $('#send-button').removeClass('disabled');
          }

           function sendMessage(headers_obj, message, callback)
          {
            var email = '';

            for(var header in headers_obj)
              email += header += ": "+headers_obj[header]+"\r\n";

            email += "\r\n" + message;

            var sendRequest = gapi.client.gmail.users.messages.send({
              'userId': 'me',
              'resource': {
                'raw': window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_')
              }
            });

            return sendRequest.execute(callback);
          }

          function getHeader(headers, index) {
            var header = '';
            $.each(headers, function(){
              if(this.name.toLowerCase() === index.toLowerCase()){
                header = this.value;
              }
            });
            return header;
          }

          function getBody(message) {
            var encodedBody = '';
            if(typeof message.parts === 'undefined')
            {
              encodedBody = message.body.data;
            }
            else
            {
              encodedBody = getHTMLPart(message.parts);
            }
            encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
            return decodeURIComponent(escape(window.atob(encodedBody)));
          }

          function getHTMLPart(arr) {
            for(var x = 0; x <= arr.length; x++)
            {
              if(typeof arr[x].parts === 'undefined')
              {
                if(arr[x].mimeType === 'text/html')
                {
                  return arr[x].body.data;
                }
              }
              else
              {
                return getHTMLPart(arr[x].parts);
              }
            }
            return '';
          }



    $("#rsvpform").submit(function(event) {
	
		/* stop form from submitting normally */
     	event.preventDefault();		
		
		/* get some values from elements on the page: */
      	var $form = $( this ),
        	url = $form.attr( 'action' );

		var	inputname  = $('#inputname').val(),
			inputemail = $('#inputemail').val(),
			inputevents = $('#inputevents').val(),
			inputmessage= $('#inputmessage').val();
			
		if (inputname == "") {
            $("#fullname").addClass("has-error");
        }
		else
		{
			$("#fullname").removeClass("has-error");
		}
		
		if (inputemail == "") {
            $("#email").addClass("has-error");
        }
		else
		{ 	
			$("#email").removeClass("has-error");
        }
		
		if (inputevents == null) {
            $("#events").addClass("has-error");
        }
		else
		{
			$("#events").removeClass("has-error");
		}

		var post_data = { input_name: $('#inputname').val(), input_email: $('#inputemail').val(), input_events: $('#inputevents').val(), input_message: $('#inputmessage').val()  };


        sendEmail();

    });

 
    
});