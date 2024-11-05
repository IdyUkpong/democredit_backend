<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->



## Steps to start the app

1. yarn installation
$ yarn

2. .env
add .env to the root file, and modify using example.env

3. create a database(DB_NAME) locally

4. run db migrate

$ npx knex migrate:latest --knexfile knexfile.ts


5. start the app

$ yarn start:dev


## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash

#Database
#create db tables
npx knex migrate:make create_users_table

#run migrations
$ npx knex migrate:latest 

#roll back migrates
npx knex migrate:rollback

# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod



```




## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Project Overview
Demo Credit is a mobile lending platform aimed at simplifying the lending and repayment process for users. The wallet service is a crucial component that allows users to receive loan disbursements, fund their accounts, transfer funds, and make withdrawals. This document outlines the design and implementation details for the wallet service MVP.

## Features
1. User Account Management
Create an Account: Users can sign up and create a wallet account.
Blacklist Check: Integration with the Lendsqr Adjutor Karma service to ensure users in the blacklist are not onboarded.
2. Account Funding
Fund Wallet: Users can deposit money into their wallet using available payment options.
3. Fund Transfer
Transfer Funds: Users can transfer funds to other registered users within the Demo Credit ecosystem.
4. Withdraw Funds
Withdraw Money: Users can initiate withdrawals from their wallet to linked bank accounts or mobile money services.

## Technical Architecture

## Tech Stack
Backend Framework: NodeJS (NestJS Framework)

Database: MySQL

ORM: Knex.js

Programming Language: TypeScript

Environment Configuration: .env for storing sensitive data

Deployment Platform: Vercel/Render/Netlify (for hosting), with MySQL configured locally or on a cloud-based database service

Blacklist Check: Integration with the Lendsqr Adjutor Karma API for real-time blacklist verification





## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
