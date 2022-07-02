// SPDX-License-Identifier: MIT
pragma solidity >=0.5.22 <0.9.0;

contract Supply_Chain {
    bytes32[] public arr;
    bytes32[] public arry;
    enum State {
        NOTVIEWED,
        ACCEPTED,
        DECLINED,
        PENDING,
        PAID
    }
    struct Order {
        address manufactureradd;
        string part_type;
        string deliverOn;
        string orderdate;
        string quantity;
        uint256 time;
        State state;
    }

    struct Part {
        address supplier;
        string manufacturedate;
        string part_type;
        string serialno;
        uint256 price;
        State state;
    }

    struct Product {
        address manufacturer;
        string serial_number;
        string product_type;
        string manufacturedate;
        bytes32 [2] parts;
        uint256 price;
    }
    struct part_recepit {
        bytes32 orderhash;
        address supplier;
        uint256 partPrice;
        string parttype;
        State state;
    }
    mapping(bytes32 => part_recepit) public part_detail;
    mapping(bytes32 => Order) public order;
    mapping(bytes32 => Product) public product;
    mapping(bytes32 => Part) public part;
    event paymentDone(address reciver, address sender, uint256 amount, bytes32);

    modifier onlymanufacturer(bytes32 hash) {
        require(
            order[hash].manufactureradd == msg.sender,
            "not the right manufacturer"
        );
        _;
    }
    modifier rightsupplier(bytes32 hash, address receiver) {
        require(
            part_detail[hash].supplier == receiver,
            "choose right supplier"
        );
        _;
    }

    //making hash
    function INFO_AND_HASH(
        string memory orderdate,
        string memory part_type,
        string memory deliverOn
    ) private pure returns (bytes32) {
   
        bytes memory b_s1 = bytes(orderdate);
        bytes memory b_s2 = bytes(part_type);
        bytes memory b_s3 = bytes(deliverOn);

        string memory s_full = new string(
            b_s1.length + b_s2.length + b_s3.length
        );
        bytes memory b_full = bytes(s_full);
        uint256 j = 0;
        uint256 i;
        
        for (i = 0; i < b_s1.length; i++) {
            b_full[j++] = b_s1[i];
        }
        for (i = 0; i < b_s2.length; i++) {
            b_full[j++] = b_s2[i];
        }
        for (i = 0; i < b_s3.length; i++) {
            b_full[j++] = b_s3[i];
        }
        return keccak256(b_full);
    }

    // creating order
    function create_order(
        string memory part_type,
        string memory deliverOn,
        string memory orderdate,
        string memory quantity
    ) public returns (bytes32) {
        State state = State.NOTVIEWED;
        bytes32 order_hash = INFO_AND_HASH(
            part_type,
            deliverOn,
            orderdate
        );
        Order memory new_order = Order(
            msg.sender,
            part_type,
            deliverOn,
            orderdate,
            quantity,
            block.timestamp / 3600,
            state
        );

        order[order_hash] = new_order;
        arr.push(order_hash);
        return order_hash;
    }

    function view_order(bytes32 orderhash) public returns (Order memory) {
        State s = State.ACCEPTED;
        order[orderhash].state = s;
        return order[orderhash];
    }

    //accepting the order

    function accept_order() public view returns (bytes32[] memory) {
        return arr;
    }

    //making part after order recivied
    function make_part(
        bytes32 orderhash,
        string memory manufacturedate,
        string memory serialno,
        uint256 price
    ) public returns (bytes32 partHash) {
        // bytes32 part_hash = INFO_AND_HASH(
        //     order[orderhash].part_type,
        //     order[orderhash].deliverOn,
        //     order[orderhash].orderdate
        // );

 bytes32 part_hash  = keccak256(abi.encode(order[orderhash].part_type));

        require(
            part[part_hash].supplier == address(0),
            "product Already exists"
        );
        State state = State.PENDING;
        Part memory new_part = Part(
            msg.sender,
            manufacturedate,
            order[orderhash].part_type,
            serialno,
            price * 10**18,
            state
        );
        part[part_hash] = new_part;
        arry.push(part_hash);
        return part_hash;
    }
    function partowned() public view returns(bytes32[] memory){
        return arry;
    }
    //after making part ,configuring part receipt
    function partrecepit(bytes32 orderhash, bytes32 partHash)
        public
        returns (bytes32)
    {
        uint256 price = part[partHash].price;
        string memory parttype = part[partHash].part_type;
        address supplier = part[partHash].supplier;
        State state = State.PENDING;
        part_recepit memory recepit = part_recepit(
            orderhash,
            supplier,
            price,
            parttype,
            state
        );
        part_detail[orderhash] = recepit;
        return orderhash;
    }

    function getpartrecepit(bytes32 orderhash)
        public
        view
        returns (part_recepit memory)
    {
        return part_detail[orderhash];
    }

    //making payment to get part
    function getparts(address payable receiver, bytes32 orderh)
        external
        payable
        rightsupplier(orderh, receiver)
        onlymanufacturer(orderh)
        returns (bool)
    {
        uint256 amount = msg.value;
        require(
            part_detail[orderh].partPrice == amount,
            "supplier price not matched"
        );

        receiver.transfer(amount);
        State state = State.PAID;
        order[orderh].state = state;
        emit paymentDone(receiver, msg.sender, msg.value, orderh);
        return true;
    }

    function make_Product(
        string memory serialno,
        string memory product_type,
        string memory creation_date,
        string [] memory parts,
        uint256 price
    ) public returns (bytes32) {
       
       bytes32 [2] memory part_hash;
          
             
        for (uint256 index = 0; index < 2; index++) {
                part_hash[index]=(keccak256(abi.encode(parts[index])));
            require(
                part[part_hash[index]].supplier != msg.sender,
                "part not available"
            );
        }
        bytes32 product_hash = INFO_AND_HASH(
            serialno,
            product_type,
            creation_date
        );

        Product memory new_product = Product(
            msg.sender,
            serialno,
            product_type,
            creation_date,
            part_hash,
            price * 10**18
        );

        product[product_hash] = new_product;

        return product_hash;
    }

    function getProductParts(bytes32 product_hash)
        public
        view
        returns (string [2] memory)
    {
        require(
            product[product_hash].manufacturer != address(0),
            "Product inexistent"
        );
        return product[product_hash].parts;
    }

    function getPartInfo(bytes32 parthash)
        public
        view
        returns (Part memory detail)
    {
        return part[parthash];
    }
}