const steem = require('steem')
const fs = require('fs')
let store = [];
async function start() {
  setInterval(async () => {
    await getData().catch(err => console.log(err))
    console.log("Delegations downloaded.", Date.now())
    return "test";
  }, 300000)
  return null;
}
start()
async function getData() {
  let data;
  //Number of the operation, it has to be the same or higher than limit
  let from = store === undefined || store.length === 0 ? 10000000 : store[store.length - 1 ][0];
  await steem.api.getAccountHistoryAsync('knacksteem.org', from, from < 1000 ? from : 1000).then(res => {
    const sorted = res.sort(function(a, b){
      const x = a[1].block;
      const y = b[1].block;
      if (x < y) {return 1;}
      if (x > y) {return -1;}
      return 0;
    });
    data = sorted;
    
  }).catch(err => {
    console.log('Downloading error', err)
    return err;
  });
  
  if(store.length === 0) {
    store = data
    await getData();
    return null;
    
    //if pulled data is the same function stops here
  } else if(data[data.length - 1][1].block === store[store.length - 1][1].block) {
    let arr = [];
    //filtering to get only delegations
    const filtered = store.filter(op => {
      return op[1].op[0] === 'delegate_vesting_shares';
    });
    filtered.map(sponsor => {
      let obj = {
        delegator: sponsor[1].op[1].delegator,
        vesting_shares: Number(sponsor[1].op[1].vesting_shares.split(' ')[0]),
        block: sponsor[1].block,
        trx_id: sponsor[1].trx_id
      };
      //checking if delegator already exists in array
      const check = arr.find(x => x.delegator === obj.delegator);
      if(check !== undefined) {

        if(check.block < sponsor[1].block) {
          //if delegation is newer it will replace the old one
          const filtered = arr.filter(item => {
            return item.trx_id !== check.trx_id;
          });
          arr = filtered;
          arr.push(obj);
        }
      } else {
        arr.push(obj);
      }

    });
    //deleting delegations with zero vests
    const filterZeroVesting = await arr.filter(item => {
      return item.vesting_shares !== 0;
    });

    const sorted = await filterZeroVesting.sort(function(a, b){
      const x = a.vesting_shares;
      const y = b.vesting_shares;
      if (x < y) {return 1;}
      if (x > y) {return -1;}
      return null;
    });
    if(!fs.existsSync('./delegations.json')) {
      fs.writeFileSync('delegations.json', JSON.stringify(sorted), err => console.log(err)).catch(err=>"Creating file error" ,err)
    }
    fs.readFile('./delegations.json', handleFile)
    function handleFile(err, data) {
    if (err) throw err
    fs.writeFileSync("delegations.json", JSON.stringify(sorted), err => console.log('Writting error', err))
    }
    return "Success!";
  } else {
    store = store.concat(data)
    await getData();
    return null;
  }

}
