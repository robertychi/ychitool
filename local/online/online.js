new Vue({
    el      : '#app',
    vuetify : new Vuetify(),
    data    : {
        token               : '',
        isShow              : false,
        isLoading           : false,
        isDialogPhoto       : false, // 對話框 開啟產品圖片
        productPhotoItems   : [], // 產品圖片列表
        isDialogPhotoShow   : false, // 對話框  顯示單一圖片
        productPhotoShowItem: {}, // 單一圖片資料
        // theme
        themeMain    : 'blue darken-2',
        themeSupply  : 'orange darken-2',
        themeCustomer: 'green darken-2',
        themePhoto   : 'cyan darken-2',
        themeVCard   : 'blue-grey darken-3',
        themeList    : 'blue-grey darken-2',
        themeVList   : 'blue-grey darken-3',
        // model
        onlineShowModel          : {
            category_number: null,
        },
        onlineShowCompanyModel   : {
            company_name : null,
            company_basic: {
                company_basic_telephone01: null,
                company_basic_telephone02: null,
                company_basic_address    : null,
            }
        },
        onlineShowPrintSetupModel: {},
        paymentMethodItems       : [
            {number: '00', name: '現金付款', hint: '現金付款', mark: '現金'},
            {number: '01', name: '先付款後出貨', hint: '先付款後出貨', mark: '先付'},
            {number: '02', name: '貨到付款', hint: '貨到付款', mark: '貨付'},
            {number: '03', name: '超商到店付款', hint: '超商付款', mark: '店付'},
            {number: '10', name: '月結', hint: '月結支付', mark: '月結'},
            {number: '20', name: 'ATM', hint: 'ATM支付', mark: 'ATM'},
            {number: '30', name: '支票', hint: '支票支付', mark: '支票'},
            {number: '40', name: '銀行匯款', hint: '銀行匯款', mark: '銀匯'},
            {number: '41', name: '電匯現金', hint: '電匯現金', mark: '電匯'},
            {number: '60', name: '電子支付-ApplyPay', hint: '電子支付-ApplyPay', mark: 'APay'},
            {number: '61', name: '電子支付-GooglePay', hint: '電子支付-GooglePay', mark: 'GPay'},
            {number: '62', name: '電子支付-LinePay', hint: '電子支付-LinePay', mark: 'LPay'},
            {number: '63', name: '電子支付-SamsungPay', hint: '電子支付-SamsungPay', mark: 'SPay'},
            {number: '64', name: '電子支付-台灣Pay', hint: '電子支付-台灣Pay', mark: 'TPay'},
        ],
        shippingMethodItems      : [
            {number: '00', name: '郵局包裹', hint: '中華郵政包裹', mark: '郵裹', category: 0, isCOD: false},
            {number: '01', name: '郵局代收貨款', hint: '中華郵政代收貨款', mark: '郵收', category: 0, isCOD: true},
            {number: '02', name: '郵局快捷', hint: '中華郵政快捷', mark: '郵快', category: 0, isCOD: false},
            {number: '99', name: '客戶取貨', hint: '客戶取貨', mark: '客取', category: 9, isCOD: false},
            {number: '98', name: '廠商送貨', hint: '廠商送貨', mark: '廠送', category: 9, isCOD: false},
            {number: '97', name: '取貨付款', hint: '取貨付款', mark: '取付', category: 9, isCOD: true},
            {number: '96', name: '送貨收款', hint: '送貨收款', mark: '送收', category: 9, isCOD: true},
            {number: '30', name: '貨運 - 大榮託運', hint: '大榮託運託運', mark: '大榮', category: 3, isCOD: false},
            {number: '33', name: '貨運 - 新竹託運', hint: '新竹託運託運', mark: '新竹', category: 3, isCOD: false},
            {number: '60', name: '便利店 - 7-11託運', hint: '7-11託運', mark: '7託', category: 6, isCOD: false},
            {number: '61', name: '便利店 - 7-11取貨付款', hint: '7-11取付', mark: '7付', category: 6, isCOD: true},
            {number: '62', name: '便利店 - 全家託運', hint: '全家託運', mark: '全託', category: 6, isCOD: false},
            {number: '63', name: '便利店 - 全家取貨付款', hint: '全家取付', mark: '全付', category: 6, isCOD: true},
            {number: '64', name: '便利店 - 萊爾富託運', hint: '萊爾富託運', mark: '萊託', category: 6, isCOD: false},
            {number: '65', name: '便利店 - 萊爾富取貨付款', hint: '萊爾富取付', mark: '萊付', category: 6, isCOD: true},
        ],
        /******** 列印的相關 ********/
        columnPerPage: 15, // 列印每頁筆數
        tableHeaders : [
            {text: '#', class: 'no'},
            {text: '產品編號', class: 'productNumber'},
            {text: '產品名稱', class: 'productName'},
            {text: '數量', class: 'productCount'},
            {text: '單價', class: 'productCost'},
            {text: '合計', class: 'productSum'},
        ],
    },
    computed: {
        getOnlineShowModelCategoryNumber() {
            return String(this.onlineShowModel.category_number);
        },
        getIsInquiryPage() {
            return (this.getOnlineShowModelCategoryNumber === '01');
        },
        getIsPurchaseOrderPage() {
            return (this.getOnlineShowModelCategoryNumber === '03');
        },
        getIsPurchaseBillPage() {
            return (this.getOnlineShowModelCategoryNumber === '05');
        },
        getIsPurchaseReturnPage() {
            return (this.getOnlineShowModelCategoryNumber === '07');
        },
        getIsQuotePage() {
            return (this.getOnlineShowModelCategoryNumber === '02');
        },
        getIsSalesOrderPage() {
            return (this.getOnlineShowModelCategoryNumber === '04');
        },
        getIsSalesBillPage() {
            return (this.getOnlineShowModelCategoryNumber === '06');
        },
        getIsSalesReturnPage() {
            return (this.getOnlineShowModelCategoryNumber === '08');
        },
        getIsAccountPayablePage() {
            return (this.getOnlineShowModelCategoryNumber === '21');
        },
        getIsAccountReceivablePage() {
            return (this.getOnlineShowModelCategoryNumber === '22');
        },
        // 屬於 Supply
        getIsSupplyPage() {
            return this.getIsInquiryPage || this.getIsPurchaseOrderPage || this.getIsPurchaseBillPage || this.getIsPurchaseReturnPage;
        },
        // 屬於 Customer
        getIsCustomerPage() {
            return this.getIsQuotePage || this.getIsSalesOrderPage || this.getIsSalesBillPage || this.getIsSalesReturnPage;
        },
        // 屬於 Account
        getIsAccountPage() {
            return this.getIsAccountPayablePage || this.getIsAccountPayablePage;
        },
        getFirmColumn() {
            if (this.getIsSupplyPage) return 'supply';
            if (this.getIsCustomerPage) return 'customer';
        },
        getPageColumn() {
            if (this.getIsInquiryPage) return 'inquiry';
            if (this.getIsPurchaseOrderPage) return 'purchase_order';
            if (this.getIsPurchaseBillPage) return 'purchase_bill';
            if (this.getIsPurchaseReturnPage) return 'purchase_return';
            if (this.getIsQuotePage) return 'quote';
            if (this.getIsSalesOrderPage) return 'sales_order';
            if (this.getIsSalesBillPage) return 'sales_bill';
            if (this.getIsSalesReturnPage) return 'sales_return';
        },
        getPageColor() {
            let category = this.token.substr(0, 2);
            switch (category) {
                case 'IN':
                    return this.themeSupply;
                case 'PO':
                    return this.themeSupply;
                case 'PB':
                    return this.themeSupply;
                case 'PR':
                    return this.themeSupply;
                case 'AP':
                    return this.themeSupply;
                case 'QU':
                    return this.themeCustomer;
                case 'SO':
                    return this.themeCustomer;
                case 'SB':
                    return this.themeCustomer;
                case 'SR':
                    return this.themeCustomer;
                case 'AR':
                    return this.themeCustomer;
                default:
                    return this.themeCustomer;
            }
        },
        getToolbarTitle() {
            if (this.getIsInquiryPage) return '詢價';
            if (this.getIsPurchaseOrderPage) return '採購';
            if (this.getIsPurchaseBillPage) return '進貨';
            if (this.getIsPurchaseReturnPage) return '進貨退回';
            if (this.getIsQuotePage) return '報價';
            if (this.getIsSalesOrderPage) return '訂購';
            if (this.getIsSalesBillPage) return '銷貨';
            if (this.getIsSalesReturnPage) return '銷貨退回';
        },
        getIsOnline() {
            return this.onlineShowModel[`${this.getPageColumn}_online`];
        },
        // 頁面的圖片
        getPhotoModels() {
            if (this.onlineShowModel[this.getPageColumn + '_photo'] !== undefined) {
                return this.onlineShowModel[this.getPageColumn + '_photo'];
            } else {
                return [];
            }
        },
        // 產品圖片
        getListPhotoModels() {
            if (this.onlineShowModel[this.getPageColumn + '_list'] !== undefined) {
                let list      = this.onlineShowModel[this.getPageColumn + '_list'];
                let listPhoto = [];
                list.forEach(function (item) {
                    if (item.product_photo.length > 0) {
                        item.product_photo.forEach(function (photo) {
                            photo.product_name   = item.product_name;
                            photo.product_number = item.product_number;
                            photo.product_sort   = item.product_sort;
                            listPhoto.push(photo)
                        })
                    }
                });
                return listPhoto;
            } else {
                return [];
            }
        },
        /**
         * 將注意事項每行改為陣列
         * @returns {Array}
         */
        getNoticeStringToArray() {
            if (this.onlineShowPrintSetupModel[this.getPageColumn + '_' + 'notice'] !== undefined) {
                if (this.onlineShowPrintSetupModel[this.getPageColumn + '_' + 'notice'] !== null) {
                    return this.onlineShowPrintSetupModel[this.getPageColumn + '_' + 'notice'].split(/\n/g);
                } else {
                    return [];
                }
            } else {
                return [];
            }
        },
        /**
         * 聯絡人
         * @returns {String}
         */
        getContactName() {
            if (this.getIsSupplyPage) {
                if (this.onlineShowModel[this.getPageColumn + '_' + 'basic'] !== undefined) {
                    return this.onlineShowModel[this.getPageColumn + '_' + 'basic']['supply_basic_contact_person'];
                }
            } else {
                if (this.onlineShowModel[this.getPageColumn + '_' + 'basic'] !== undefined) {
                    return this.onlineShowModel[this.getPageColumn + '_' + 'basic']['customer_basic_contact_person'];
                }
            }
        },
        /**
         * 統一編號
         * @returns {String}
         */
        getVat() {
            if (this.getIsSupplyPage) {
                if (this.onlineShowModel[this.getPageColumn + '_' + 'basic'] !== undefined) {
                    return this.onlineShowModel[this.getPageColumn + '_' + 'basic']['supply_basic_vat'];
                }
            } else {
                if (this.onlineShowModel[this.getPageColumn + '_' + 'basic'] !== undefined) {
                    return this.onlineShowModel[this.getPageColumn + '_' + 'basic']['customer_basic_vat'];
                }
            }
        },
        /**
         * 電話01
         * @returns {String}
         */
        getTelephone01() {
            if (this.getIsSupplyPage) {
                if (this.onlineShowModel[this.getPageColumn + '_' + 'basic'] !== undefined) {
                    return this.onlineShowModel[this.getPageColumn + '_' + 'basic']['supply_basic_telephone01'];
                }
            } else {
                if (this.onlineShowModel[this.getPageColumn + '_' + 'basic'] !== undefined) {
                    return this.onlineShowModel[this.getPageColumn + '_' + 'basic']['customer_basic_telephone01'];
                }
            }
        },
        /**
         * 傳真
         * @returns {String}
         */
        getTelephone02() {
            if (this.getIsSupplyPage) {
                if (this.onlineShowModel[this.getPageColumn + '_' + 'basic'] !== undefined) {
                    return this.onlineShowModel[this.getPageColumn + '_' + 'basic']['supply_basic_telephone02'];
                }
            } else {
                if (this.onlineShowModel[this.getPageColumn + '_' + 'basic'] !== undefined) {
                    return this.onlineShowModel[this.getPageColumn + '_' + 'basic']['customer_basic_telephone02'];
                }
            }
        },
        /**
         * 手機01
         * @returns {String}
         */
        getMobilePhone01() {
            if (this.getIsSupplyPage) {
                if (this.onlineShowModel[this.getPageColumn + '_' + 'basic'] !== undefined) {
                    return this.onlineShowModel[this.getPageColumn + '_' + 'basic']['supply_basic_mobile_phone01'];
                }
            } else {
                if (this.onlineShowModel[this.getPageColumn + '_' + 'basic'] !== undefined) {
                    return this.onlineShowModel[this.getPageColumn + '_' + 'basic']['customer_basic_mobile_phone01'];
                }
            }
        },
        /**
         * 郵區
         * @returns {String}
         */
        getZipCode() {
            if (this.getIsSupplyPage) {
                if (this.onlineShowModel[this.getPageColumn + '_' + 'basic'] !== undefined) {
                    return this.onlineShowModel[this.getPageColumn + '_' + 'basic']['supply_basic_zip_code'];
                }
            } else {
                if (this.onlineShowModel[this.getPageColumn + '_' + 'basic'] !== undefined) {
                    return this.onlineShowModel[this.getPageColumn + '_' + 'basic']['customer_basic_zip_code'];
                }
            }
        },
        /**
         * 地址
         * @returns {String}
         */
        getAddress() {
            if (this.getIsSupplyPage) {
                if (this.onlineShowModel[this.getPageColumn + '_' + 'basic'] !== undefined) {
                    return this.onlineShowModel[this.getPageColumn + '_' + 'basic']['supply_basic_address'];
                }
            } else {
                if (this.onlineShowModel[this.getPageColumn + '_' + 'basic'] !== undefined) {
                    return this.onlineShowModel[this.getPageColumn + '_' + 'basic']['customer_basic_address'];
                }
            }
        },
        /**
         * 地址
         * @returns {String}
         */
        getVatNumber() {
            if (this.getIsSupplyPage) {
                if (this.onlineShowModel[this.getPageColumn + '_' + 'basic'] !== undefined) {
                    return this.onlineShowModel[this.getPageColumn + '_' + 'basic']['supply_basic_vat_number'];
                }
            } else {
                if (this.onlineShowModel[this.getPageColumn + '_' + 'basic'] !== undefined) {
                    return this.onlineShowModel[this.getPageColumn + '_' + 'basic']['customer_basic_vat_number'];
                }
            }
        },
        /**
         * 日期
         * @returns {String}
         */
        getDate() {
            if (this.onlineShowModel[this.getPageColumn + '_' + 'date'] !== undefined) {
                return this.onlineShowModel[this.getPageColumn + '_' + 'date'];
            }
        },
        /**
         * 編號
         * @returns {String}
         */
        getNumber() {
            if (this.onlineShowModel[this.getPageColumn + '_' + 'number'] !== undefined) {
                return this.onlineShowModel[this.getPageColumn + '_' + 'number'];
            }
        },
        /**
         * 出貨 / 近貨 日期
         * @returns {String}
         */
        getDateExpect() {
            if (this.onlineShowModel[this.getPageColumn + '_' + 'date_expect'] !== undefined) {
                return this.onlineShowModel[this.getPageColumn + '_' + 'date_expect'];
            }
        },
        getProductList() {
            if (this.onlineShowModel[this.getPageColumn + '_' + 'list'] !== undefined) {
                return this.onlineShowModel[this.getPageColumn + '_' + 'list'];
            } else {
                return [];
            }
        },
        getNoTaxTotal() {
            if (this.onlineShowModel[this.getPageColumn + '_' + 'board'] !== undefined) {
                return this.onlineShowModel[this.getPageColumn + '_' + 'board'][this.getPageColumn + '_' + 'no_tax_total'];
            }
        },
        getTax() {
            if (this.onlineShowModel[this.getPageColumn + '_' + 'board'] !== undefined) {
                return this.onlineShowModel[this.getPageColumn + '_' + 'board'][this.getPageColumn + '_' + 'tax'];
            }

        },
        getTotal() {
            if (this.onlineShowModel[this.getPageColumn + '_' + 'board'] !== undefined) {
                return this.onlineShowModel[this.getPageColumn + '_' + 'board'][this.getPageColumn + '_' + 'total'];
            }

        },
        getCountTotal() {
            if (this.onlineShowModel[this.getPageColumn + '_' + 'board'] !== undefined) {
                return this.onlineShowModel[this.getPageColumn + '_' + 'board'][this.getPageColumn + '_' + 'count_total'];
            }
        },
        getShippingMethod() {
            if (this.getIsSupplyPage) {
                if (this.onlineShowModel[this.getPageColumn + '_' + 'basic'] !== undefined) {
                    return this.onlineShowModel[this.getPageColumn + '_' + 'basic']['supply_basic_shipping_method'];
                }
            } else {
                if (this.onlineShowModel[this.getPageColumn + '_' + 'basic'] !== undefined) {
                    return this.onlineShowModel[this.getPageColumn + '_' + 'basic']['customer_basic_shipping_method'];
                }
            }
        },
        getPaymentMethod() {
            if (this.getIsSupplyPage) {
                if (this.onlineShowModel[this.getPageColumn + '_' + 'basic'] !== undefined) {
                    return this.onlineShowModel[this.getPageColumn + '_' + 'basic']['supply_account_payment_method'];
                }
            } else {
                if (this.onlineShowModel[this.getPageColumn + '_' + 'basic'] !== undefined) {
                    return this.onlineShowModel[this.getPageColumn + '_' + 'basic']['customer_account_payment_method'];
                }
            }
        },
        /**
         * 取得運送方法
         */
        getShippingMethodModel() {
            return this.shippingMethodItems.find(x => x.number === this.getShippingMethod);
        },
        /**
         * 取得運送方法 Hint
         */
        getShippingMethodModelHint() {
            if (this.getShippingMethodModel) return this.getShippingMethodModel.hint;
        },
        /**
         * 取得運送註解
         */
        getShippingComment() {
            if (this.getIsSupplyPage) {
                if (this.onlineShowModel[this.getPageColumn + '_' + 'basic'] !== undefined) {
                    return this.onlineShowModel[this.getPageColumn + '_' + 'basic']['supply_basic_shipping_comment'];
                }
            } else {
                if (this.onlineShowModel[this.getPageColumn + '_' + 'basic'] !== undefined) {
                    return this.onlineShowModel[this.getPageColumn + '_' + 'basic']['customer_basic_shipping_comment'];
                }
            }
        },
        /**
         * 取得付款方法
         */
        getPaymentMethodModel() {
            return this.paymentMethodItems.find(x => x.number === this.getPaymentMethod);
        },
        /**
         * 取得付款方法 Hint
         */
        getPaymentMethodModelHint() {
            if (this.getPaymentMethodModel) return this.getPaymentMethodModel.hint;
        },
        /**
         * 備註
         */
        getDescription() {
            return this.onlineShowModel[this.getPageColumn + '_' + 'description']
        },
        // textarea 換行範例
        getDescriptionToHtml() {
            if (this.getDescription) {
                return this.getDescription.replace(/\n/g, "<br />");
            } else {
                return '目前並無備註內容！';
            }
        },
        /**
         * 判斷注意事項是否是空的
         * @returns {boolean}
         */
        getIsNoticeEmpty() {
            return (this.getDescription === null);
        },

        /******** 列印的相關 ********/
        /**
         * 將輸入的資料拆分分頁
         * @returns {Array}
         */
        getUnpackedModels() {
            let result = [];
            if (this.getProductList.length > 0) {
                for (let i = 0, len = this.getProductList.length; i < len; i += this.columnPerPage) {
                    result.push(this.getProductList.slice(i, i + this.columnPerPage));
                }
            }
            return result;
        },
        /**
         * 計算每頁的金額合計
         * @returns {Array}
         */
        getPerPageSum() {
            let result = [];
            if (this.getUnpackedModels.length > 0) {
                this.getUnpackedModels.forEach(function (item){
                    let sum = 0;
                    item.forEach(function (box){
                        sum += box.product_sum;
                    })
                    result.push(sum);
                })
                return result;
            } else {
                return [];
            }
        },
        /**
         * 計算總頁數
         * @returns {Number}
         */
        getTotalPage() {
            let dataLength = this.getProductList.length;
            let totalPage  = dataLength % this.columnPerPage;
            // 沒有資料時，顯示頁數為1
            if (dataLength === 0) {
                return 1;
            } else {
                if (totalPage) {
                    return Number(Math.floor(dataLength / this.columnPerPage) + 1);
                } else {
                    return Number(Math.floor(dataLength / this.columnPerPage));
                }
            }
        },
        /**
         * 總筆數
         * @returns {Number}
         */
        getTotalPcs() {
            return this.getProductList.length;
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
        loadOnlineData(token) {
            this.isLoading = true;
            axios.get('/api/onlineJob/' + token)
                .then(response => {
                    // 是否顯示 和 導入資料
                    if (response.data.isTokenExist && response.data.isModelExist) {
                        if (Boolean(response.data.isOnline)) {
                            this.isShow                    = true;
                            this.onlineShowModel           = response.data.model;
                            this.onlineShowCompanyModel    = response.data.companyModel;
                            this.onlineShowPrintSetupModel = response.data.printSetupModel;
                        } else {
                            this.isShow = false
                        }
                    } else {
                        this.isShow = false
                    }
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        /**
         * 打開 對話框 顯示圖片列表
         * @param item
         */
        openDialogPhoto(item) {
            this.isDialogPhoto     = true;
            this.productPhotoItems = item.product_photo;
        },
        /**
         * 打開 對話框 顯示單一圖片
         * @param item
         */
        openDialogPhotoShow(item) {
            this.isDialogPhotoShow    = true;
            this.productPhotoShowItem = item;
        },
        /******** 列印的相關 ********/
        /**
         * 去列印
         */
        toPrint() {
            print();
        }
    },
    mounted() {
        this.$vuetify.theme.dark = true;
        this.token               = window.location.pathname.substr(8);
        this.loadOnlineData(this.token);

    },
})
