var axios = require("axios");

var t = (error) => {
    // return i18n.t(error);
    return error;
}

export class Axios {
    static success = (response) => {
        return response.data;
    }
    
    static error = (error) => {
        if (error && error.response) {
            error = error.response;
        }
        if (error && error.data) {
            error = error.data.error;
        }
        if (error && error.statusCode) {
            if (0 <= error.statusCode && error.statusCode < 200) {
                return error.message;
            } else if (200 <= error.statusCode && error.statusCode < 300) {
                return t("common:error.success");
            } else if (300 <= error.statusCode) {
                if (error.message) {
                    return error.message;
                }
                return t("common:error.network");
            } else {
                return t("common:error.network");
            }
        }
        return t("common:error.network");
    }

    static get = async function(url: string, params: any = null, headers: any = null) {
        var result = {
            data: null,
            message: ""
        };
        let query = '';
        if (params) {
            for (let key in params) {
                let field = encodeURIComponent(key);
                let value = encodeURIComponent(params[key]);
                query += `${field}=${value}&`
            }
        }
        headers = headers || {};
        await axios.get(url + '?' + query, {
            headers
        }).then(
            response => result.data = this.success(response)
        ).catch(
            error => result.message = this.error(error)
        );
        return result;
    }
    
    static post = async function(url: string, params: any = null, headers: any = null, data: any) {
        var result = {
            data: null,
            message: ""
        };
        let query = '';
        if (params) {
            for (let key in params) {
                let field = encodeURIComponent(key);
                let value = encodeURIComponent(params[key]);
                query += `${field}=${value}&`
            }
        }
        headers = headers || {};
        await axios.post(url + '?' + query, data, {
            headers
        }).then(
            response => result.data = this.success(response)
        ).catch(
            error => result.message = this.error(error)
        );
        return result;
    }

    static delete = async function (url: string, params: any = null, headers: any = null) {
        var result = {
            data: null,
            message: ""
        };
        let query = '';
        if (params) {
            for (let key in params) {
                let field = encodeURIComponent(key);
                let value = encodeURIComponent(params[key]);
                query += `${field}=${value}&`
            }
        }
        headers = headers || {};
        await axios.delete(url + '?' + query, {
            headers
        }).then(
            response => result.data = this.success(response)
        ).catch(
            error => result.message = this.error(error)
        );
        return result;
    }
}