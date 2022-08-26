const transaksiModel = require("../models/transaksi")

const transakasiController = {
    allTransaksi: async(req, res)=>{
        try{
            const currentPage = Number(req.query.currentPage) || 1;
            const numberPerPage = Number(req.query.numberPerPage) || 5;
            const startPages = (currentPage - 1) * numberPerPage;
            const sortby = req.query.sortby || "id";
            const sort = req.query.sort || "ASC";
            const result = await  transaksiModel.selectAll(numberPerPage,startPages,sort,sortby);
            const {rows: [count]} = await transaksiModel.countTransaksi();
            const totalData = parseInt(count.count);
            const totalPages = Math.ceil(totalData/numberPerPage);
            res.status(200).json({
              pagination:
                      {
                        currentPage: currentPage,
                        numberPerPage: numberPerPage,
                        totalData: totalData,
                        totalPages: totalPages
                      },
                        data:result.rows,
                      });
        }catch(err){
            console.log(err);
        }
    },
    getTransaksi : (req, res) =>{
      const id = req.params.id; 
      transaksiModel.selectAll(id)
      .then(result => res.json(result.rows))
      .catch(err => res.send(err));
    },
    insert: (req, res) =>{
      const {id, address, buying, transaksi_detail_id } = req.body;
      transaksiModel.insert(id, address, buying, transaksi_detail_id)
      .then(res.json("Transaksi created"))
      .catch(err => res.send(err));
    },
    update: (req, res) =>{
      const id = Number(req.params.id);
      const { address, buying, transaksi_detail_id } = req.body;
      transaksiModel.update(id, address, buying, transaksi_detail_id)
      .then(res.json("Updated transaksion"))
      .catch(err => res.send(err.message));
    },
    delete: (req, res) =>{
      const id = req.params.id;
      transaksiModel.deleteTransaksi(id)
      .then(res.json("Deleted transaksi"))
      .catch(err => res.send(err));
    }
};



module.exports = transakasiController;