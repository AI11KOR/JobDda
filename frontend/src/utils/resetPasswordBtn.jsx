import { sendEmailResetCodeBtn, verifyEmailResetCodeBtn } from "../api/emailApi";
import { EmailVal } from "./validation";

export const sendEmailResetBtn = ({ email, onSuccess }) => {
    const handleSendEmail = async () => {

        if(!email) {
            alert('이메일을 적어주세요');
            return;
        }

        if(!EmailVal(email)) {
            alert('이메일을 정확하게 적어주세요');
            return;
        }

        try {
            alert('인증번호 전송 성공. 3분내 입력해주세요');
            await sendEmailResetCodeBtn(email);
            onSuccess();
        } catch (error) {
            console.log(error);
            alert('이메일 인증에 오류가 발생하였습니다.')
        }
    }
    return handleSendEmail;
}

export const verifyEmailResetBtn = ({email, code, onSuccess }) => {
    const handleVerifyEmail = async () => {

        if(!code) {
            alert('인증번호를 입력해주세요');
            return;
        }

        try {
            await verifyEmailResetCodeBtn(email, code.trim());
            alert('인증이 완료되었습니다.');
            onSuccess();
        } catch (error) {
            console.log(error);
            alert('이메일 인증확인에 오류가 발생했습니다. 다시 시도해 주세요')
        }
    }
    return handleVerifyEmail;
}