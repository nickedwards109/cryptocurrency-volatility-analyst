This application analyzes cryptocurrency trade data in real-time in order to provide real-time data on cryptocurrency volatility, which can be useful for traders who want to make decisions based on changes in volatility. Technologies in this project include Node, Express, WebSockets, and MongoDB.

Here's what the application does:

The server connects to the Bitfinex WebSocket API. When Bitfinex broadcasts a message indicating a new BTCUSD trade, the server compares it to an earlier trade in order to calculate a rate of return between those trades. A custom statistics library analyzes the trailing 24 hours of rate of return calculations to find the standard deviation, which indicates how much the rate of return has varied over that time period. This represents the volatility. That volatility calculation is then broadcasted over a WebSocket connection to any connected clients.

Here's how to set it up:

1. Open up a terminal and clone the repo with 'git clone git@github.com:nickedwards109/cryptocurrency-volatility-server.git'
2. Sign up for cloud database services with MLab:
     - Visit www.mlab.com
     - Sign up for a new user account
     - Visit your email account and click on the link from MLab to verify your email address
3. Provision a MongoDB database:
     - On the www.mlab.com home page, next to 'MongoDB Deployments', click 'Create New'
     - Under 'Cloud Provider', select 'Amazon Web Services'
     - Under 'Plan Type', select 'Sandbox'
     - Select 'Continue'
     - Select the AWS region that is geographically nearest to where the application will mostly be used
     - Select 'Continue'
     - Enter a database name. For example, 'cryptocurrency-volatility-db'
     - Select 'Continue'
     - Select 'Submit Order'
4. Set a user and password for the database:
     - Under 'MongoDB Deployments', select the database you have created
     - Select 'Users'
     - Select 'Add database user'
     - Enter a username, password, and password confirmation
     - Select 'Create'
5. Configure your database connection string:
     - Find the text on the page that says: 'To connect using a driver via the standard MongoDB URI'
     - Copy the string underneath that to your clipboard
     - In a text editor, replace \<dbuser> with your user name and \<dbpassword> with your password
6. Start the server:
     - Run:
     MONGODB_URI=<string from step 5> node server.js
7. Connect a WebSocket client to your local server
     - Open a new terminal window
     - From the new terminal window, install the command-line WebSocket tool 'wscat' by running 'npm install -g wscat'
     - Establish a WebSocket connection to your local server by running 'wscat -c ws://localhost:3000'

Whenever a new BTC/USD trade happens on the Bitfinex exchange, you should now see an object appearing in your terminal that represents the volatility of rates of return over the trailing 24 hours before the trade happened.
