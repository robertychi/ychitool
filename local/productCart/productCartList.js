new Vue({
    el      : '#app',
    vuetify : new Vuetify(),
    data    : {
        windowSize              : {x: 0, y: 0},
        themeProductCart        : 'purple',
        isDrawer                : true,
        publicToken             : '', // 公開 token
        pathName                : '',
        companyModel            : {
            company_name : '',
            company_basic: {
                company_basic_telephone01: '',
                company_basic_telephone02: '',
                company_basic_address    : '',
            }
        }, // 公司資料
        models                  : [], // productCartModels
        isProductCartModelsEmpty: false, // 資料是不是空的
        isExitPublicToken       : true, // 是否有 public_token
        isExitUserModel         : true, // 是否有使用者資料
        isLoading               : false,// 讀取中
        isChecking              : false,// 檢查中

        query                : {
            page          : 1,
            column        : 'product_number',
            direction     : 'asc',
            perPage       : 15,
            searchColumn  : 'product_class_name',
            searchOperator: 'like',
            searchInput   : '',
            lastPage      : 0,
            total         : -1,
        },
        imageFailedIndexItems: [], // 存讀不圖的  index

        productClassModels: [], // 類別資料

        searchInput: '', // 用於搜尋條

        discountCount: 0, // 折扣品數

        isBlock: true, // 塊狀顯示

    },
    watch   : {
        getQueryPage(val) {
            this.loadProductCartListItems(this.publicToken, this.query);
        }
    },
    computed: {
        /**
         * 資料是否為空的
         * @return {boolean}
         */
        getIsModelsEmpty() {
            return this.models.length === 0;
        },
        getQueryPage() {
            return this.query.page;
        }
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
        },

    },
    methods : {
        /** 工作尺寸變更 */
        onResize() {
            this.windowSize = {x: window.innerWidth, y: window.innerHeight};
        },
        /** sss v-navigation-drawer sss */
        /**
         * 切換 Sidebar
         */
        toggleSidebar() {
            this.isDrawer = !this.isDrawer;
        },
        /** eee v-navigation-drawer eee */
        checkPublicToken(publicToken, query) {
            this.isChecking = true;
            axios.get(`/api/productCartCheckData/${publicToken}`)
                .then(response => {
                    this.isExitUserModel   = response.data.isExitUserModel
                    this.isExitPublicToken = response.data.isExitPublicToken
                    if (this.isExitPublicToken && this.isExitUserModel) {
                        this.companyModel = response.data.companyModel;
                        this.pathName     = response.data.pathName;
                        this.loadProductCartListItems(publicToken, query);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => {
                    this.isChecking = false;
                });
        },
        // http://localhost:3000/api/productCartList/IB6Tj21?column=product_class_id&direction=asc&page=1&perPage=10&searchColumn=product_class_id&searchOperator=equal&searchInput=2
        loadProductCartListItems(publicToken, query) {
            this.isLoading = true;
            axios.get(`/api/productCartList/${publicToken}?column=${query.column}&direction=${query.direction}&page=${query.page}&perPage=${query.perPage}&searchColumn=${query.searchColumn}&searchOperator=${query.searchOperator}&searchInput=${query.searchInput}`)
                .then(response => {
                    this.models                    = response.data.models.data;
                    this.productClassModels        = response.data.productClassModels;
                    this.$isProductCartModelsEmpty = response.data.$isProductCartModelsEmpty;
                    this.discountCount             = response.data.discountCount;
                    // this.query                     = query;
                    this.query.lastPage            = response.data.models.last_page;
                    this.query.total               = response.data.models.total;
                    this.query.perPage             = response.data.models.per_page;
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => {
                    // 列表讀取延時
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 600);
                });
        },
        /**
         * 用於判斷圖片是否有存在
         * @param index
         */
        onImgError(index) {
            this.imageFailedIndexItems.push(index);
        },
        /**
         * 用於Drawer 切換類別
         * @param productClassName 產品類別名稱
         */
        changeProductClass(productClassName) {
            this.query.searchColumn = 'product_class_name'
            this.query.searchInput  = productClassName
            this.loadProductCartListItems(this.publicToken, this.query)
            this.searchInput = '';
            this.checkWindowSize();
        },
        /**
         * 上一頁
         */
        prevPage() {
            let query       = this.query;
            this.query.page = query.page - 1;
            this.loadProductCartListItems(this.publicToken, this.query)
        },
        /**
         * 下一頁
         */
        nextPage() {
            let query       = this.query;
            this.query.page = query.page + 1;
            this.loadProductCartListItems(this.publicToken, this.query)
        },
        /**
         * 搜尋條用
         * @param searchInput
         */
        enterSearchInput(searchInput) {
            this.query.searchColumn = 'product_cart_name';
            this.query.searchInput  = searchInput;
            this.loadProductCartListItems(this.publicToken, this.query);
        },
        /**
         * 選擇折扣
         */
        selectDiscount() {
            this.query.searchColumn = 'product_cart_discount';
            this.query.searchInput  = 1;
            this.loadProductCartListItems(this.publicToken, this.query);
            this.checkWindowSize();
        },
        /**
         * 到顯示頁面
         */
        toShowPage(id) {
            window.location.href = `http://${this.pathName}/productCartShow/${this.publicToken}/${id}`;
        },
        /**
         * 檢查 大小
         * 當小於 1264 將drawer 關起來
         */
        checkWindowSize() {
            if (this.windowSize.x < 1264) {
                this.isDrawer = false;
            }
        }
    },
    mounted() {
        this.$vuetify.theme.dark = true;
        let routers              = window.location.pathname.split('/').filter(Boolean);
        this.publicToken         = routers[1];
        this.checkPublicToken(this.publicToken, this.query);
        this.checkWindowSize();
    },
})
