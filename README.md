# Currency Converter 

Available publically at https://currency-converter-dylan.netlify.app/.

## Installation

- :octocat:Clone this Github repository with `git clone https://github.com/Dlearn/currency-converter.git`
- 📂 Navigate into the folder
- 📝 Run `yarn` to install dependencies
- ⚡ Run `yarn start` to start the server. parcel.js by default routes it to localhost:1234.

## Features

This simple App converts one currency to another. It also renders a line graph of 2 currencies in the past 7 days. 

## Technologies 

### parceljs 

I decided to try a new bundler other than webpack for this project.

### Semantic UI

Provides nice UI elements with little effort.

### No Typescript

I wanted to create a simple site that is easy to modify and iterate. If this were a larger project, static typing would be important for maintainability and reliability.

### No React-Router

This is a very simple 1 page app. There are no additional routes.

### Source of truth from exchangeratesapi

exchangeratesapi provides the current and historical currency rates.
When the user proceeds to the Checkout Page, the browser calls the server with the items in the cart. The server calls Stripe to create a PaymentIntent, which is returned and stored in the browser to make the final payment.
