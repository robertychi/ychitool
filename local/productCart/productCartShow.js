new Vue({
    el      : '#app',
    vuetify : new Vuetify(),
    data    : {
        windowSize:{x:0,y:0},
        themeProductCart : 'purple',
        publicToken      : '',
        pathName         : '',
        productCartId    : 0,
        companyModel     : {
            company_name : '',
            company_basic: {
                company_basic_telephone01: '',
                company_basic_telephone02: '',
                company_basic_address    : '',
            }
        }, // 公司資料
        model            : {
            product_cart_name             : '',
            product_cart_description      : '',
            product_cart_count            : 1,
            product_cart_stock_count_total: 0,
            product_cart_price            : 0,
            product_cart_no_discount_price: 0,
            product_cart_sum              : 0,
            product_cart_shipping_method  : '00',
            product_cart_payment_method   : '00',
            product_cart_top              : false,
            product_cart_show             : true,
            product_cart_stock            : false,
            product_cart_include_tax      : false,
            product_cart_discount         : false,
            // 關聯
            product_id      : 0,
            product_class_id: 0,
            product_stock   : {
                product_stock_count_total: 0,
            },
            // 圖片
            product_cart_photo: [],
        }, // productCartModel
        isModelExist     : true,
        isExitPublicToken: true, // 是否有 public_token
        isExitUserModel  : true, // 是否有使用者資料
        isReading        : false,// 讀取中
        isChecking       : false,// 檢查中

        imageFailedHeader    : false, // 標題照片是否讀得到
        imageFailedIndexItems: [], // 存讀不圖的  index

        isDialogPhotoDetailed: false, // 對話框 圖片詳細
        photoDetailedItem    : {
            photo_file_name: ''
        },

    },
    computed: {
        //product_cart_description
        getDescription() {
            return this.model.product_cart_description;
        },
        /**
         * 判斷注意事項是否是空的
         * @returns {boolean}
         */
        getIsDescriptionEmpty() {
            return (this.getDescription === null);
        },
        /**
         * 將注意事項每行改為陣列
         * @returns {Array}
         */
        getDescriptionStringToArray() {
            if (this.getIsDescriptionEmpty) return [];
            else return this.getDescription.split(/\n/g);
        },
    },
    filters : {
        fltCompanyNameFormat(value) {
            if (value !== null && value !== undefined) {
                let changeValue = '';
                if (value.indexOf('股份有限公司') > 0) {
                    changeValue = value.substring(0, value.indexOf('股份有限公司')) + '(股)';
                } else if (value.indexOf('有限公司') > 0) {
                    changeValue = value.substring(0, value.indexOf('有限公司')) + '(限)';
                } else if (value.indexOf('企業社') > 0) {
                    changeValue = value.substring(0, value.indexOf('企業社')) + '(企)';
                } else if (value.indexOf('工作室') > 0) {
                    changeValue = value.substring(0, value.indexOf('工作室')) + '(室)';
                } else if (value.indexOf('大學') > 0) {
                    changeValue = value.substring(0, value.indexOf('大')) + '(大)';
                } else if (value.indexOf('加工廠') > 0) {
                    changeValue = value.substring(0, value.indexOf('加工廠')) + '(加)';
                } else if (value.indexOf('實業社') > 0) {
                    changeValue = value.substring(0, value.indexOf('實')) + '(實)';
                } else {
                    if (value.length > 10) {
                        changeValue = value.substring(0, 10) + '(略)';
                    } else {
                        changeValue = value;
                    }
                }
                return changeValue;
            }
        },
        fltCommonFormat(value) {
            let valueType = typeof (value);
            if (valueType === 'string') {
                return value;
            } else if (valueType === 'number') {
                if (!(value === null || value === 0 || value === undefined)) {
                    return String(value).toString().replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, function (all, pre, groupOf3Digital) {
                        return pre + groupOf3Digital.replace(/\d{3}/g, ',$&');
                    });
                } else {
                    return 0;
                }
            } else {
                return value
            }
        },
        /**
         * 計算工作天數 Filter
         * @param tableValue
         * @param docValue
         * @return {string}
         */
        fltDifferenceWorkingDays(tableValue, docValue) {
            let startDate   = new Date(docValue);
            let endDate     = new Date(tableValue);
            let workingDay  = 0;
            let currentDate = startDate;
            while (currentDate <= endDate) {
                let weekDay = currentDate.getDay();
                if (weekDay !== 0 && weekDay !== 6) {
                    workingDay++;
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return `${workingDay}`;
        }
    },
    methods : {
        /** 工作尺寸變更 */
        onResize(){
            this.windowSize = {x: window.innerWidth, y: window.innerHeight};
        },
        checkPublicToken(publicToken, id) {
            this.isChecking = true;
            axios.get(`/api/productCartCheckData/${publicToken}`)
                .then(response => {
                    this.isExitUserModel   = response.data.isExitUserModel
                    this.isExitPublicToken = response.data.isExitPublicToken
                    if (this.isExitPublicToken && this.isExitUserModel) {
                        this.companyModel = response.data.companyModel;

                        this.loadProductCartShowItem(publicToken, id);
                    }
                    this.pathName = response.data.pathName;
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => {
                    this.isChecking = false;
                });
        },
        loadProductCartShowItem(publicToken, id) {
            this.isReading = true;
            axios.get(`/api/productCartShow/${id}/`)
                .then(response => {
                    this.isModelExist = response.data.isExist;
                    if(this.isModelExist){
                        this.model = response.data.model;
                    }
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => {
                    // 列表讀取延時
                    setTimeout(() => {
                        this.isReading = false;
                    }, 600);
                });
        },
        /**
         * 用於判斷圖片是否有存在
         * 抬頭的照片
         */
        onHeaderImgError() {
            this.imageFailedHeader = true;
        },
        onImagesError(index) {
            this.imageFailedIndexItems.push(index);
        },
        /**
         * 顯示圖片
         * @param item
         */
        openPhotoDetailed(item) {
            this.isDialogPhotoDetailed = true;
            this.photoDetailedItem     = item;
        }
    },
    mounted() {
        this.$vuetify.theme.dark = true;
        let routers              = window.location.pathname.split('/').filter(Boolean);
        this.publicToken         = routers[1];
        this.productCartId       = routers[2];
        this.checkPublicToken(this.publicToken, this.productCartId);
    },
})
