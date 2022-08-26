const Pool = require("../config/db");

const selectAll = (numberPerPage,startPages,sort,sortby) =>{
    return Pool.query(`SELECT * FROM transaksi ORDER BY ${sortby} ${sort} LIMIT ${numberPerPage} OFFSET ${startPages}`);
};
const select = (id) =>{
    return Pool.query(`SELECT * FROM transakasi WHERE id=${id}`);
};
const countTransaksi = () =>{
    return Pool.query("SELECT COUNT(*) FROM transaksi");
};
const insert = (id, address, buying, transaksi_datail_id) =>{
    return Pool.query(`INSERT INTO transaksi(id, address, buying, transaksi_detail_id) VALUES (${id},'${address}', ${buying}, ${transaksi_datail_id})`);
};

const update = (id, address, buying, transaksi_datail_id) =>{
    return Pool.query(`UPDATE transaksi SET address='${address}',
    buying='${buying}',
    transaksi_detail_id=${transaksi_datail_id} WHERE id=${id}`);
};

const deleteTransaksi = (id) =>{
    return Pool.query(`DELETE FROM transaksi WHERE id=${id}`);
};

module.exports = {selectAll,select, countTransaksi, insert, update, deleteTransaksi};