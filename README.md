# Svinge

## Run docker command

```bash
docker run svinge 9090:9090 -p
```

## Use as a library

```javascript
const polygonSvinge = new Svinge({
    rpcs: [],
    chain: Chain.Polygon
})

const solanaSvinge = new Svinge({
    rpcs: [],
    chain: Chain.Polygon
})

const solanaTransaction = await solanaSvinge.getTransaction({
    hash: ""
})

const polygonTransaction = await polygonSvinge.getTransaction({
    hash: ""
})
```