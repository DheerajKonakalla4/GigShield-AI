# GigShield AI

### AI-Powered Parametric Income Protection for India’s Gig Delivery Workforce

## Overview

GigShield AI is an AI-powered parametric insurance platform designed to protect gig delivery workers from **income loss caused by external disruptions** such as extreme weather, pollution, or sudden social restrictions.

Millions of delivery partners working for platforms such as **Swiggy, Zomato, Amazon, Flipkart, Zepto, and Blinkit** depend on daily deliveries for their livelihood. However, external events beyond their control often prevent them from working, resulting in immediate income loss.

GigShield AI introduces a **fully automated parametric insurance system** that detects disruptions in real time and **instantly compensates workers for lost income**, without requiring manual claims.

The platform leverages **AI risk modeling, automated trigger detection, and instant payouts** to build a scalable safety net for gig workers.

---

# Problem Statement

Gig economy workers face unpredictable income disruptions due to:

* Heavy rainfall and flooding
* Extreme heat conditions
* Severe air pollution
* Curfews and sudden city restrictions
* Delivery platform outages

These events can reduce working hours and cause workers to lose **20–30% of their monthly income**.

Traditional insurance models are not suitable because:

* Claim processes are slow
* Documentation requirements are high
* Coverage does not focus on income loss

GigShield AI solves this using **parametric insurance**, where payouts are triggered automatically when predefined external conditions occur.

---

# Persona Focus

## Target Persona

Food Delivery Rider (Example: Swiggy/Zomato Partner)

### Profile

Name: Ravi Kumar
City: Bangalore
Daily Earnings: ₹600 – ₹900
Working Hours: 8–10 hours/day

### Key Challenges

* Cannot deliver during heavy rainfall
* Pollution spikes reduce outdoor activity
* Curfews restrict movement
* Platform outages prevent order assignments

### Impact

Loss of ₹300 – ₹700 per day depending on disruption duration.

GigShield AI ensures Ravi receives **automated compensation whenever such disruptions occur**.

---

# Platform Workflow

1. **Worker Registration**

   * Delivery partner signs up using mobile number
   * Location and delivery platform details are captured

2. **AI Risk Assessment**

   * AI evaluates worker’s operating area using historical weather and disruption data
   * A personalized weekly premium is calculated

3. **Policy Activation**

   * Worker subscribes to a weekly insurance plan
   * Coverage becomes active immediately

4. **Real-Time Monitoring**

   * External APIs continuously monitor environmental and social conditions

5. **Parametric Trigger Detection**

   * When predefined conditions occur, the system automatically detects disruptions

6. **Automated Claim Processing**

   * Claims are initiated without manual intervention

7. **Instant Payout**

   * Worker receives compensation through UPI or digital payment gateway

---

# Weekly Premium Model

GigShield AI uses a **subscription-based weekly insurance model** tailored for gig workers.

| Plan     | Weekly Premium | Coverage                   |
| -------- | -------------- | -------------------------- |
| Basic    | ₹10            | ₹300/day income protection |
| Standard | ₹20            | ₹500/day income protection |
| Pro      | ₹30            | ₹800/day income protection |

## AI Dynamic Pricing

The premium is dynamically adjusted based on:

* Geographic risk level
* Historical disruption frequency
* Weather vulnerability
* Pollution levels
* Delivery density

Example:

* Worker in a low-risk zone: ₹10/week
* Worker in flood-prone zone: ₹18/week

This ensures **fair and adaptive pricing**.

---

# Parametric Disruption Triggers

GigShield AI uses predefined triggers to automate claims.

## Environmental Triggers

Heavy Rainfall
Rainfall > 60 mm within 6 hours

Extreme Heat
Temperature > 45°C

Severe Pollution
AQI > 400

Flood Alert
Government flood warning issued

## Social Triggers

City Curfew
Government announced movement restriction

Zone Shutdown
Local market or delivery zone closure

## Platform Triggers

Delivery Platform Outage
Order assignment system unavailable > 2 hours

Once a trigger occurs, the system automatically activates compensation.

---

# AI / ML Integration

Artificial Intelligence plays a key role in three areas:

## 1. Risk Modeling

Machine learning models analyze historical environmental data to predict disruption risks for each geographic zone.

Inputs:

* Weather history
* Pollution patterns
* Flood risk
* Traffic patterns

Output:
Risk score for worker location.

---

## 2. Dynamic Premium Calculation

A regression-based ML model calculates optimal weekly premiums based on risk exposure.

Features include:

* Worker location
* Historical disruptions
* Delivery hours
* Platform demand levels

---

## 3. Fraud Detection

AI algorithms detect suspicious claims using anomaly detection.

Fraud signals include:

* GPS spoofing
* Claims during normal weather
* Duplicate claims
* Location mismatch

Models compare real-time data with historical disruption patterns.

---

# Platform Choice

GigShield AI will primarily be developed as a **mobile-first platform**.

## Why Mobile?

Gig workers primarily use smartphones for their work.

Advantages:

* Easy onboarding
* GPS-based verification
* Instant notifications
* Faster claim updates
* Simple policy management

A lightweight web dashboard will also be available for **admin analytics and monitoring**.

---

# Integration Architecture

The system integrates with multiple external services.

## Data APIs

Weather APIs
Source: OpenWeather API

Pollution APIs
Source: AQICN

Traffic and location APIs
Source: Google Maps API

Government alerts
Curfew or disaster notifications

---

## Payment Integration

Simulated payment gateways for instant payouts:

* Razorpay Test Mode
* Stripe Sandbox
* UPI Simulator

---
## Tech Stack

**Frontend**

* React Native / Flutter (Mobile App)
* React / Next.js (Admin Dashboard)

**Backend**

* Node.js + Express.js (API & Business Logic)
* REST APIs for service communication

**Database**

* PostgreSQL (Users, Policies, Claims)
* MongoDB (Event logs & disruption data)

**AI / ML**

* Python
* Scikit-learn (Risk scoring & premium prediction)
* Pandas / NumPy (Data processing)

**External APIs**

* OpenWeather API (Weather triggers)
* AQICN API (Air quality monitoring)
* Google Maps API (Location validation)

**Payments (Simulation)**

* Razorpay Test Mode / Stripe Sandbox
* UPI simulator for instant payout demo

**Deployment & Tools**

* AWS / Firebase
* Docker
* GitHub + GitHub Actions
* Postman for API testing


# Analytics Dashboard

The platform includes dashboards for both workers and insurers.

## Worker Dashboard

* Active weekly coverage
* Earnings protected
* Claim history
* Disruption alerts

## Admin Dashboard

* Total policies
* Loss ratios
* Regional risk analytics
* Predictive disruption insights

---

# Development Plan

Week 1
Research and problem analysis
Define personas and disruption triggers
Design system architecture

Week 2
Develop onboarding workflow
Implement basic premium calculation logic
Integrate weather API for trigger simulation

Week 3–4
Build automated claim trigger system
Implement policy management
Develop claims module

Week 5–6
Integrate AI risk modeling
Add fraud detection module
Implement instant payout simulation
Build analytics dashboard

---

# Innovation Highlights

GigShield AI introduces several modern insurance innovations:

* Parametric insurance for gig workers
* AI-powered risk-based pricing
* Zero-touch automated claims
* Real-time disruption detection
* Instant digital payouts
* Fraud-resistant verification

The platform transforms insurance from a **reactive claims process into a proactive financial safety system**.

---

# Future Scope

* Integration with delivery platforms for real-time earnings data
* Advanced predictive weather modeling
* Personalized coverage recommendations
* Regional risk heatmaps
* Blockchain-based claim verification

---
# Team Vision

GigShield AI aims to create **financial resilience for gig workers**, ensuring that external disruptions no longer threaten their livelihoods.

By combining **AI intelligence, parametric insurance, and instant digital payments**, the platform builds a scalable and transparent safety net for the gig economy.
