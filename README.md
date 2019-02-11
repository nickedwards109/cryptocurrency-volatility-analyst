## Overview
Cryptocurrency Volatility Analyst is a software application that provides real-time calculations that indicate how much the market price of Bitcoin has varied during a recent trailing time period. The application listens for data that represents new trades on Bitfinex, a Bitcoin exchange. Each time a trade happens, the application calculates and displays the standard deviation of trade prices over the previous 5 minutes, which is a measure of how much the prices varied during that time period. Traders often refer to this metric as the 'price volatility'. This metric can be useful for traders who want to consider Bitcoin's price volatility in their trading decisions.

## Relevance of price volatility
Price volatility is a quantitative metric of how much an asset's price varies, and it serves as a proxy for the risk associated with investing in that asset. This metric is relevant to traders who seek to allocate their capital among different assets in a manner that is appropriate for their own tolerance for risk.

For example, a trader who has a high tolerance for risk might allocate a high proportion of their capital in an asset whose price is highly volatile. This would enable the high-risk trader to try to buy low, hold the asset for a short time period, and sell it for a higher price soon thereafter. Alternatively, a trader who has a low tolerance for risk might allocate more of their capital in a more stable asset whose price doesn't vary significantly.

Many traders who consider whether to invest capital in Bitcoin are unsure of how risky the investment is and unsure of whether it is becoming more or less risky over time. By providing a proxy for riskiness in the form of a price volatility calculation, Cryptocurrency Volatility Analyst is valuable to traders because it provides a piece of information that they could consider when determining what proportion of their capital to invest in Bitcoin.

## Technical summary
The application works in 4 stages that are executed every time a Bitcoin trade happens on Bitfinex.

#### 1. Getting raw data representing a trade
The application gets real-time trade data using a communications protocol called WebSocket, which generally enables two computers to exchange information quickly over a single persistent connection. In this case, the application connects to a WebSocket interface provided by Bitfinex. When a Bitcoin trade happens on the Bitfinex exchange, Bitfinex broadcasts a message over the WebSocket connection. This message contains the trade price and a timestamp indicating the time when the trade happened. The application receives the message via its WebSocket connection.

#### 2. Storing the trade data
The application extracts the trade price and timestamp from the raw message that was sent by Bitfinex. It then stores the trade price and timestamp in a MongoDB database.

#### 3. Calculating the volatility of recent trade prices
The application retrieves the prices of every trade that has happened within the last 5 minutes. A custom statistics library calculates the standard deviation of that set of prices. This represents the price volatility.

#### 4. Displaying the price volatility
The application utilizes its own WebSocket interface as a means for displaying the price volatility calculation. Once the application has calculated the price volatility, it sends this calculation in a message over its WebSocket interface. A user who is connected over that interface will see the price volatility in their terminal.

## Technical guide for building the application
This guide assumes that you have [Git](https://git-scm.com/) installed and assumes that you are familiar with the [Unix command line](https://www.learnenough.com/command-line-tutorial/basics).

1. Open up a terminal and clone the source code repository by running:
     `$ git clone git@github.com:nickedwards109/cryptocurrency-volatility-server.git`

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
     - Enter a database name. For example, 'cryptocurrency-volatility-db-test' or 'cryptocurrency-volatility-db-production'
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
     `$ MONGODB_URI=<string from step 5> node server.js`

7. Let the application run for at least 5 minutes. During this time, the application will collect trade price information from Bitfinex and insert it into the database. The database needs to contain at least 5 minutes of historical price data in order to analyze the volatility over the trailing 5 minute time period.

8. Connect a WebSocket client to your local server:
     - Open a new terminal window
     - In the new terminal window, install the command-line WebSocket tool 'wscat' by running:
     `$ npm install -g wscat`
     - Establish a WebSocket connection to the application by running:
     `$ wscat -c ws://localhost:3000`

Whenever a new Bitcoin trade happens on the Bitfinex exchange, you should see an object appear in your terminal that represents the price volatility over the trailing 5 minutes before the trade happened.

## Running the tests
The application contains tests that verify the following behavior:

 - The application can insert a new trade into the database

 - The application can get trade prices out of an array containing a set of trades

 - The application can calculate the standard deviation of a set of prices

To run the tests, follow steps 1, 2, 3, 4, and 5 of the technical guide for building the application. Then, run the following command:
     `$ MONGODB_URI=<string from step 5> npm test`

Passing tests will be indicated by text in green, and failing tests will be indicated by text in red. All tests are passing as of the current version on 2/10/19.

## Contributing
The source code and a list of outstanding issues are available at [the source code repository](https://github.com/nickedwards109/cryptocurrency-volatility-analyst). Anyone is welcome to add new issues, and anyone is welcome to fork the source code, make changes, and make a pull request.
