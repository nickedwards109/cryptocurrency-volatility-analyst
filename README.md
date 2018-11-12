This application analyzes cryptocurrency trade data and provides real-time calculations of price volatility, which can be useful for traders who want to make decisions based on changes in volatility. Technologies in this project include Node, Express, WebSockets, and MongoDB.

Here's what the application does:

The application acts as a WebSocket client and connects to the Bitfinex WebSocket API. When Bitfinex broadcasts a message indicating a new BTCUSD trade, the application inserts the price and time of the trade into a database. The application then retrieves the prices of every trade that has happened within the last 5 minutes. A custom statistics library calculates the standard deviation of that set of prices. This represents the price volatility. The application acts as a WebSocket server and broadcasts the price volatility to any connected clients.

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
6. Run the application. Run:
     MONGODB_URI=<string from step 5> node server.js
7. Let the application run for at least 5 minutes. During this time, the application will be collecting trade price information from BitFinex and inserting it into the database. The database needs to contain at least 5 minutes of historical price data in order to analyze the volatility over the trailing 5 minute time period.
8. Connect a WebSocket client to your local server:
     - Open a new terminal window
     - In the new terminal window, install the command-line WebSocket tool 'wscat' by running 'npm install -g wscat'
     - Establish a WebSocket connection to the application by running 'wscat -c ws://localhost:3000'

Whenever a new BTC/USD trade happens on the BitFinex exchange, you should see an object appear in your terminal that represents the price volatility over the trailing 5 minutes before the trade happened.
