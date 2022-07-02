
const contract1  = artifacts.require('Supply_Chain');
contract("part making",accounts => {
    it("should create a wheel and store it",async  () =>
        {
            const serial_number = "123456"
            const part_type = "wheel"
            const creation_date = "12/12/18"
            const contract2 = await contract1.deployed();
            console.log(accounts[0]);
            await contract2.make_part(serial_number, part_type, creation_date, { from: accounts[0] });
              
                p_hash = await web3.utils.soliditySha3(accounts[0], web3.utils.fromAscii(serial_number),
                                                 web3.utils.fromAscii(part_type), web3.utils.fromAscii(creation_date))
                                                 console.log(p_hash);
                const y = await contract2.part.call(p_hash, { from: accounts[0] });
                    
                    assert.equal(y["manufacturer"], accounts[0])
                    assert.equal(y["serial_number"], serial_number)
                    assert.equal(y["part_type"], part_type)
                    assert.equal(y["creation_date"], creation_date)
                
            
        }
    );


    it("it should manufacture product" , async ()=>{
        const contract2 = await contract1.deployed();
        const serial_number = "10456";
        const product_type = "car";
        const creation_date = "23/06/2022";
        const parts_type = ['wheel','wheel1','wheel2','wheel3','engine','transmission'];
        const serial_no = [1234,12345,123456,1,2,3];
        let part_array = [];


        for (let index = 0; index < serial_no.length; index++) {

            await contract2.make_part(serial_no[index], parts_type[index], creation_date, { from: accounts[0] });

            part_array.push(await web3.utils.soliditySha3(accounts[0], web3.utils.fromAscii(serial_no[index]),
                                                 web3.utils.fromAscii(parts_type[index]), web3.utils.fromAscii(creation_date)));   
        }

        const x = await contract2.make_Product(serial_number,product_type,creation_date,part_array ,{from:accounts[0]});

        p_hash = await web3.utils.soliditySha3(accounts[0], web3.utils.fromAscii(serial_number),
        web3.utils.fromAscii(product_type), web3.utils.fromAscii(creation_date))
        console.log(p_hash);
        const y = await contract2.product.call(p_hash, { from: accounts[0] });
        assert.equal(y["manufacturer"], accounts[0])
                    assert.equal(y["serial_number"], serial_number)
                    assert.equal(y["product_type"], product_type)
                    assert.equal(y["creation_date"], creation_date)

    })
})