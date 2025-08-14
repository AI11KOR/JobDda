import { sendEmailCodeBtn, verifyEmailCodeBtn } from '../api/emailApi';
import { EmailVal } from './validation';

export const sendEmailBtn = ({ email, onSuccess }) => {
    const handleSendClick = async () => {

        if(!email) {
            alert('이메일을 입력하세요');
            return;
        }

        if(!EmailVal(email)) {
            alert('이메일 형식이 올바르지 않습니다.');
            return;
        }

        try {
            await sendEmailCodeBtn(email);
            alert('이메일 전송에 성공했습니다. 3분내 입력해주세요')
            onSuccess();
            
        } catch (error) {
            if(error.response?.data?.message === '이미 가입된 회원입니다.') {
                alert('이미 가입된 회원입니다.');
                return;
            } else {
                console.log(error);
                alert("이메일 전송에 실패했습니다.")
            }    
        }
    }
    return handleSendClick
}

export const verifyEmailBtn = ({ email, code, onSuccess}) => {
    const handleVerifyClick = async () => {

        if(!code) {
            alert('인증번호를 입력해주세요');
            return;
        }

        try {
            await verifyEmailCodeBtn(email, code.trim());
            alert('인증번호 인증 성공')
            onSuccess();
            
        } catch (error) {
            console.log(error);
            alert('이메일 확인 실패 다시 시도해주세요')
        }
    }

    return handleVerifyClick;
}