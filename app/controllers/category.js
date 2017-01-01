const Category = require('../models/category');

// categoryadmin page
exports.new = function(req, res) {
    res.render('category_admin', {
        title: 'imooc 后台分类录入页',
        category: {}
    });
};


// admin poster category
exports.save = function(req, res) {
    var _category = req.body.category;
    var category = new Category(_category);

    category.save((err, category) => {
        if (err) {
            console.error(err);
        }
        res.redirect(303, '/admin/category/list');
    });
};

// categorylist page
exports.list = function(req, res) {
    Category.fetch(function(err, catetories) {
        if (err) {
            console.error(err);
        }
        res.render('categorylist', {
            title: 'imooc 分类列表页',
            catetories: catetories
        });
    });
};

