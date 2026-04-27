==============
### Deduction fees:
0.5% upto 1000$
0.4% upto 10_000$
0.3% upto 100_000$
0.2% upto 1000_000$
0.1% upto 10_000_000$
0.05% upto 100_000_000$
0.01% upto 1000_000_000$

static fund fees now 0.5% for now
=====
### Profit fees: 
> fees will be deducted only on successfull invesments from the (profit only not the capital)
> 1/3 of the fees deducted yearly, and the remaining 2/3 deducted when the user withdraw his money.
1.5% upto 10_000$
1.4% upto 100_000$
1.3% upto 1000_000$
1.2% upto 10_000_000$
1.1% upto 100_000_000$
1% upto 1000_000_000$

static profit fees 1.5% for now
======
### System Entities: 

Admin (ignored)
User
Family/Profile (skip now)
Transaction (Mocked - comes from fake bank api)
Sweep (The specific event that triggers the calculation and movement of round-ups.)
Redemption (The formal term for selling assets and moving funds back to the user's bank.)
AssetAllocation (Placing money into a stock)
InboundTransfer (User adding money manually)
AI_Insight
=====
### System Componenets

User profile
SweepAction engine
Fees deduction engine
AI insights
Dashboard
Emotional messages engine
Our investments fund/wallet
Stocks Allocator engine
MockBankAPI (Mocked - External)
MockExchangeAPI (Mocked - External)
=======


MockBankAPI (External Entity): Represents the source of truth for user funds. It triggers the webhook when a purchase occurs with a trasiaction data.
MockExchangeAPI (External Entity): Represents the market. It provides the current valuations for the Gold, Index Funds, and High-Risk stocks during the time simulations.

### System Entities (Data Models / Database Tables)

These represent the state and history of your system. Instead of creating separate tables for every type of money movement, use a unified `LedgerEntry` with a "Type" field to maintain a clean, double-entry accounting standard.

* **User:** Stores demographics, target goals, risk profile (e.g., "Default 20/75/5"), and total Asset Under Management (AUM) for fee tier calculation.
* **Profile:** each profile has many users (faimily, friends, ...)
* **TransactionEvent:** The raw webhook payload saved directly from the `MockBankAPI` (contains merchant tag, amount, and timestamp).
* **DigitalWallet (Portfolio):** Tracks the user's current holdings and values for each specific asset class (Fiat, Gold, Index Fund, High-Risk).
* **LedgerEntry:** A unified record of all financial movements. Includes a `Type` enum:
    * `SWEEP`: The automated round-up movement.
    * `INBOUND_TRANSFER`: User manually adding funds (Seeding).
    * `ASSET_ALLOCATION`: Placing fiat into the specific stocks/funds.
    * `REDEMPTION`: Withdrawing funds back to the user's bank (Harvesting).
    * `FUND_FEE`: Recording the platform or success fees taken.
* **AI_Insight:** The generated emotional message, linked to the trigger event (e.g., a specific transaction or a yearly growth milestone).

---

### System Components (Services / Background Engines)

These are the active workers and controllers in your NestJS/Node backend that execute the logic.

* **Online Open Bank Api**: 
  * **Webhook Gateway:** Exposes the endpoint to receive and validate the raw data from the `MockBankAPI`.
  * **Api for taking fund:** create an endpoint that act as a user behanve and take the fractions fund from the back`MockBankAPI`.
* **Sweep Processor:** Listens for new transactions, calculates the spare change round-up, and triggers the fee calculator.
* **Fee Engine:** Checks the user's tier to calculate the 0.5% -> 0.1% platform fee on sweeps, and calculates the 1.5% success fee on annual profit milestones.
* **Asset Allocator Engine:** Takes the net swept funds and distributes them into the user's portfolio according to their risk profile (e.g., the 24 gold/75 index fund/1 high risk split).
* **AI Emotional Engine:** Monitors transaction habits (e.g., spending on cigarettes) and portfolio growth, feeding this data into an LLM prompt to generate the personalized, encouraging nudges.
* **Real-Time Dashboard Service (SSE):** Manages the Server-Sent Events connection to push live balance updates, new charts, and AI messages instantly to the frontend.
* **Time-Travel Simulator (Maybe a frontend only):** The controller that accepts "Advance 1 Month/Year" requests, fetches new market values from the `MockExchangeAPI`, recalculates the `DigitalWallet`, and broadcasts the growth via SSE.

---

### External Interfaces (Mocked)

* **MockBankAPI:** Triggers the webhook with purchase data (`TransactionEvent`) and asked for taking fund.
* **MockExchangeAPI:** Provides the market valuation multipliers for Gold, Index Funds, and High-Risk stocks when the Time-Travel Simulator runs.

=====
Here are the updated user stories, Bahi, streamlined to focus entirely on the expected actions and integrated with your new fee structures, the 24/75/1 asset allocation, and the multi-user profile baseline. 

### Epic 1: The "Golden Path" (Ingestion & Sweeping)

**1. Simulate Mock Transaction (Demo UI)**
* **As an** Investor (or Hackathon Judge),
* **I want to** click a "Simulate Purchase" button,
* **So that** I can trigger a simulated webhook payload to the backend, demonstrating the transaction ingestion flow without needing a live Open Banking connection.

**2. The Sweep Engine Processing**
* **As the** Sweep Processor,
* **I want to** intercept incoming transactions and calculate the spare change round-up to the nearest fraction,
* **So that** the system can isolate the exact fiat amount to be converted into an investment.

**3. The Fees Engine (Fund & Profit)**
* **As the** Fees Engine,
* **I want to** evaluate the profile's active tier to deduct the 0.5% `FUND_FEE` on new deposits, and calculate the 1.5% profit fee (taking 1/3 yearly and reserving 2/3 for withdrawal),
* **So that** the platform properly monetizes the service while adhering to the Mudarabah profit-sharing principles.

**4. Asset Allocation (The 24/75/1 Rule)**
* **As the** Asset Allocator Engine,
* **I want to** automatically distribute the net swept funds into Gold (24%), Index Funds (75%), and High-Risk Stocks (1%),
* **So that** the digital wallet immediately reflects the Sharia-compliant, optimized risk profile for long-term growth.

---

### Epic 2: Shared Profiles & Wealth Management

**5. Multi-User Profile Aggregation**
* **As a** Family Member or Friend in a shared profile,
* **I want to** have my individual bank transactions trigger sweeps that route into the shared digital wallet,
* **So that** our group can build collective wealth and reach shared financial goals faster.

**6. Manual Seeding (Top-Ups)**
* **As an** Investor,
* **I want to** manually inject a lump sum of capital into the fund,
* **So that** I can boost the portfolio's compounding power outside of my daily automated round-ups.

**7. Harvesting (Withdrawal)**
* **As an** Investor,
* **I want to** withdraw a specific amount from the shared or personal portfolio,
* **So that** the system liquidates the proportional assets, deducts the remaining 2/3 profit fees from the un-taxed gains, and simulates routing the money back to my bank.

---

### Epic 3: The Dashboard & Real-Time Feedback

**8. Real-Time UI Updates**
* **As an** Investor,
* **I want to** watch my dashboard charts and balances update dynamically via SSE,
* **So that** I experience an immediate feedback loop and a dopamine hit every time a sweep or market shift occurs.

**9. Time-Travel Simulation**
* **As a** Hackathon Judge,
* **I want to** trigger a fast-forward mechanism (e.g., "Advance 1 Year"),
* **So that** the backend simulates market volatility, applies the yearly 1/3 profit fee deduction, and broadcasts the compounded growth to the frontend instantly.

---

### Epic 4: The AI Analyst & Emotional Engagement

**10. Habit Identification**
* **As the** AI Emotional Engine,
* **I want to** parse the merchant tags from the transaction feed,
* **So that** I can identify recurring spending patterns that represent financial leaks or bad habits.

**11. Generating Emotional Nudges**
* **As an** Investor,
* **I want to** receive personalized, AI-generated insights regarding my spending,
* **So that** I clearly understand the long-term opportunity cost of my daily habits and feel encouraged to invest that money instead.