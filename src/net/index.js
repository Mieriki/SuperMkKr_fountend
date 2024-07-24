import axios from "axios";
import { ElMessage } from "element-plus";

function accessHeader() {
	return {}
}

const defaultError = (error) => {
    console.error(error)
    ElMessage.error('发生了一些错误，请联系管理员')
}

const defaultFailure = (message, status, url) => {
    console.warn(`请求地址: ${url}, 状态码: ${status}, 错误信息: ${message}`)
    ElMessage.warning(message)
}

function analysisCode(code) {
	if (code === 200) {
		return true
	} 
	return false
}

function internalPost(url, data, headers, success, failure, error = defaultError){
    axios.post(url, data, { headers: headers }).then(({data}) => {
        if(analysisCode(data.code))
            success(data.data)
        else
            failure(data.message, data.code, url)
    }).catch(err => error(err))
}

function internalGet(url, headers, success, failure, error = defaultError){
    axios.get(url, { headers: headers }).then(({data}) => {
        if(analysisCode(data.code))
            success(data.data)
        else
            failure(data.message, data.code, url)
    }).catch(err => error(err))
}

function post(url, data, success, failure = defaultFailure) {
    internalPost(url, data, accessHeader() , success, failure)
}

function get(url, success, failure = defaultFailure) {
    internalGet(url, accessHeader(), success, failure)
}


export { post, get, accessHeader }
