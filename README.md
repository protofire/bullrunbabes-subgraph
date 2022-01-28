# BullrunBabes [https://www.bullrunbabes.com/rules]
---
This subgraph allows you to interact with the game contracts and query information about the project's tokens and transactions made.

#### The graph 
https://thegraph.com/hosted-service/subgraph/protofire/bullrunbabes
#### API
https://api.thegraph.com/subgraphs/name/protofire/bullrunbabes 

## Entities

### Card
Information related to the *NFT*. Here you can find the transaction history also.
For example, if you know the ID of the token you can get the transaction's history about it:
```
{
  card(id: 1919) {
    tier
    history {
      timestamp
      type
      from {
        id
      }
      to {
        id
      }
    }
  }
}
```
Or get all cards by owner address:
```
{
  cards(where: {owner: "0xb0151d256ee16d847f080691c3529f316b2d54b3"}) {
    id
    history {
      timestamp
      type
      from {
        id
      }
      to {
        id
      }
    }
  }
}
```

### Transaction
We have different kind of transaction that you can find into our sub graph: 

***Draw*** is when the NFT it's minted.

***Buy*** the NFT was transferred from one address to another.

***Trade*** the NFT was traded for another different NFT, which could be one-to-one or more than one depending on the level of the card want to receive.

As each one it's a transaction itself, all these transactions types could be queried by the same entity: 
```
{
  transactions(where: {type: TRADE}) {
    timestamp
    card {
      id
    }
  }
}
```

### Date
Through this entity, you could get the transactions made on a specific date and you can do that with the "human format" of a date.
```
{
  dates(where: {day: "01", month: "01", year: "2022"}) {
    transactions {
      type
      card {
        id
      }
    }
  }
}
```