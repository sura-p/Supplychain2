
const Web3 = require('web3');
const web3 = new Web3('HTTP://127.0.0.1:7545');
const conf = require('../../build/contracts/Supply_Chain.json');
const conf2 = require('../../build/contracts/ownwership.json');
const contract_Address = conf.networks['5777'].address;
const contract_Address2 = conf2.networks['5777'].address;
const contract_ABI = conf.abi;
const contract_ABI2 = conf2.abi;
const deploying = new web3.eth.Contract(contract_ABI,contract_Address);
const deploying2 = new web3.eth.Contract(contract_ABI2,contract_Address2);
const keccak256 = require('keccak256')
const private_key_s = '2ad0320d51aba9bb9c3a063cde84ef43ea47e6cf1f314243ae54df3880795e99';
const private_key_m = '8d32404bdfd1df907ef28667e3b1f20748f0a1952e00bfd55360ffd706907249';
const private_key_c = 'eaacf34a82d019be106b7e9b0eaeebcbaf6773e44bcf55abae91ef4a72572f90';
// var flash = require('connect-flash');
let array = [];
const login = (req,res)=>{

    res.render('index');
}

const supplier = async (req,res)=>{
   
    
    const orderdetail = await deploying.methods.partowned().call();
    res.render('supplier',{newListItems:orderdetail}
    );

   // const x = document.getElementById('part-factory-address').value;
    
}

const manufacturer = async (req,res)=>{
    res.render('manufacturer');
}
const makeorder= (req,res)=>{
    res.render('makeorder');
}


const manufacturer_make_order = async (req,res)=>{

    const part = (req.body.parts).toString();
    const exdelidate = (req.body.dd).toString();
    const quantity = (req.body.quantity).toString();
    const d = (req.body.orderdate).toString();
   
    const orderhash = await deploying.methods.create_order(part,exdelidate,d,quantity).call({from:'0xC41E3ebE11759EFF6999A38E6c07B79ACA590367',gas:3000000});
    const nonce = await web3.eth.getTransactionCount('0xC41E3ebE11759EFF6999A38E6c07B79ACA590367');
    const gasprice = await web3.eth.getGasPrice();
    const orderhash2 = await deploying.methods.create_order(part,exdelidate,d,quantity).encodeABI();
    const tx= {
        from: '0xC41E3ebE11759EFF6999A38E6c07B79ACA590367',
        to: contract_Address,
        gas: 1000000,
        gasPrice:gasprice,
        data:orderhash2,
        nonce
      }


      const signature = await web3.eth.accounts.signTransaction(tx,private_key_m);
      const recepit = await web3.eth.sendSignedTransaction(signature.rawTransaction);
    array.push(orderhash);
    
    res.send(orderhash);
     
    
}


const part_Recepit = async(req,res)=>{
    const orderId = (req.body.orderid).toString();
    orderrecepit=  await deploying.methods.getpartrecepit(orderId).call();
    res.send(orderrecepit);
}

const payment = async(req,res)=>{
    const order = (req.body.orderid).toString();
    const reciver = (req.body.reciver).toString();
    const price = (req.body.price).toString();
    const x = await deploying.methods.getparts(reciver,order).send({from:'0xC41E3ebE11759EFF6999A38E6c07B79ACA590367',value:`${price}`});
    res.send(x);
}

const get_orderlist = async (req,res)=>{
    const orderdetail = await deploying.methods.accept_order().call();
       res.render('extra',{newListItems:orderdetail})
}

const supplier_getorder = async (req,res)=>{

    const oid =  (req.body.orderid).toString();
    console.log(oid);
     const orderdetail = await deploying.methods.view_order(oid).call();
     res.send(`<h3>manufacturer : ${orderdetail[0]}  <br>Part type : ${orderdetail[1]} <br>  :Delivered on : ${orderdetail[2]} <br> OrderDate : ${orderdetail[3]} <br> Quantity : ${orderdetail[4]} <br>Time: ${orderdetail[5]}</h3>`);
 }

 const supplier_accept_order = async (req,res)=>{
    const orderdetail = await deploying.methods.get_order(oid).call({from:'0xb04B6a731ee4C1554Ef2114B3fb9d8515858B260',gas:100000});
}

const supplier_build_part = async (req,res)=>{
    //res.sendFile(path.join(__dirname, '../client/supplier.html'))
   const order = (req.body.orderid).toString();
   const serial = (req.body.srno).toString();
   const price = (req.body.price).toString();
   const mfg_date = (req.body.mfgdate).toString();

    const hash = await deploying.methods.make_part(order,mfg_date,serial,price).call({from:'0xc6CE20ADC48E921Aeb0CAB1c0f2A6EFCd2dd59c4',gas:300000});
    const nonce = await web3.eth.getTransactionCount('0xc6CE20ADC48E921Aeb0CAB1c0f2A6EFCd2dd59c4');
    const gasprice = await web3.eth.getGasPrice();
    const orderhash2 = await deploying.methods.make_part(order,mfg_date,serial,price).encodeABI();
    const tx1= {
        from: '0xc6CE20ADC48E921Aeb0CAB1c0f2A6EFCd2dd59c4',
        to: contract_Address,
        gas: 1000000,
        gasPrice:gasprice,
        data: orderhash2,
        nonce
      }


      const signature1 = await web3.eth.accounts.signTransaction(tx1,private_key_s);
      const recepit1 = await web3.eth.sendSignedTransaction(signature1.rawTransaction);

      const nonce2 = await web3.eth.getTransactionCount('0xc6CE20ADC48E921Aeb0CAB1c0f2A6EFCd2dd59c4');
     
      
      const recepit4  = await deploying.methods.partrecepit(order,hash.toString()).call({from:'0xc6CE20ADC48E921Aeb0CAB1c0f2A6EFCd2dd59c4',gas:300000});

      const nonce3 = await web3.eth.getTransactionCount('0xc6CE20ADC48E921Aeb0CAB1c0f2A6EFCd2dd59c4');
      const recepit = await deploying.methods.partrecepit(order,hash.toString()).encodeABI();
      const tx3= {
          from: '0xc6CE20ADC48E921Aeb0CAB1c0f2A6EFCd2dd59c4',
          to: contract_Address,
          gas: 1000000,
          gasPrice:gasprice,
          data:recepit,
          nonce3
        }
  
  
        const signature3=await web3.eth.accounts.signTransaction(tx3,private_key_s);
        await web3.eth.sendSignedTransaction(signature3.rawTransaction);
    
    res.send(recepit4);
   
}
const change_ownership = async(req,res)=>{
    const to  = (req.body.transferTo).toString();
    const p_hash  =(req.body.part_Hash).toString();
    const orderh = (req.body.Ohash).toString();
   const x = await deploying.getPastEvents('paymentDone',{
    filter: {myIndexedParam: [0,1,2,3], myOtherIndexedParam: 'orderh'},
        fromBlock:'latest'
    });
    if(x[0].returnValues.reciver != null &&
    x[0].returnValues.amount !=null){
        const ownership = await deploying2.methods.changeOwnership(0,p_hash,to).send({from:'0xC41E3ebE11759EFF6999A38E6c07B79ACA590367'});
        res.send("transfered")
    }
    else
    {
        res.send("payment not done")
    }
    
    

}

const x = async (req,res)=>{
    p = (req.body.g).toString();
    const x2 = await deploying2.methods.currentowner(p).call();
    res.send(x2);

}

const recepit_manufacturer = async(req,res)=>{
    res.render('gres',{code:0})
    
}
const recepit_manufacturer2 = async(req,res)=>{
    const oid =  (req.body.email).toString();
    const orderdetail = await deploying.methods.getpartrecepit(oid).call();
    let y;
    if (orderdetail[4]==3) {
        y="pending"
        
    }
    res.render('gres',{code:1,id:orderdetail[0],supplier:orderdetail[1],price:orderdetail[2],pname:orderdetail[3],payment:y});
    
}


const manufacturer_make_product = async(req,res)=>{

    let serial_no = [];
    const part1 = (req.body.part1).toString();
    const part2 = (req.body.part2).toString();
    serial_no.push(part1);
    serial_no.push(part2);
    
    const product_type = (req.body.producttype).toString();
    const serialno = (req.body.srno).toString();
    const price = (req.body.price).toString();
    const creation_date = (req.body.mfgdate).toString();
    const hash = await deploying.methods.make_Product(serialno,product_type,creation_date,serial_no,price).call({from:'0xC41E3ebE11759EFF6999A38E6c07B79ACA590367',gas:30000000});
    res.send(hash)
    // const nonce = await web3.eth.getTransactionCount('0xC41E3ebE11759EFF6999A38E6c07B79ACA590367');
    // const gasprice = await web3.eth.getGasPrice();
    // const orderhash2 = await deploying.methods.make_Product(serialno,product_type,creation_date,part_array,price).encodeABI();
    // const tx1= {
    //     from: '0xC41E3ebE11759EFF6999A38E6c07B79ACA590367',
    //     to: contract_Address,
    //     gas: 10000000,
    //     gasPrice:gasprice,
    //     orderhash2,
    //     nonce
    //   }


    //   const signature1 = await web3.eth.accounts.signTransaction(tx1,private_key_m);
    //   const recepit1 = await web3.eth.sendSignedTransaction(signature1.rawTransaction);
    
    //   const nonce2 = await web3.eth.getTransactionCount('0xC41E3ebE11759EFF6999A38E6c07B79ACA590367');
    // const orderhash3 =  await deploying2.methods.add_ownership(0,hash.toString()).encodeABI();
    // const tx2= {
    //     from: '0xC41E3ebE11759EFF6999A38E6c07B79ACA590367',
    //     to: contract_Address2,
    //     gas: 10000000,
    //     gasPrice:gasprice,
    //     orderhash3,
    //     nonce2
    //   }


    // const signature2 = await web3.eth.accounts.signTransaction(tx2,private_key_m);
    //   const recepit2 = await web3.eth.sendSignedTransaction(signature2.rawTransaction);
    //   res.send(hash)
}

module.exports = {x,makeorder,manufacturer,get_orderlist,supplier,login,supplier_accept_order,manufacturer_make_order,supplier_build_part ,change_ownership,supplier_getorder,part_Recepit,payment,manufacturer_make_product,recepit_manufacturer ,recepit_manufacturer2}