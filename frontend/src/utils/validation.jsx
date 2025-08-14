

export const EmailVal = (emailValue) => {
    const regex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
    return regex.test(emailValue);
}

export const PasswordVal = (passwordValue) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
    return regex.test(passwordValue)
}

// 비밀번호 에러 메시지 반환 함수
export const getPasswordErrorMessage = (passwordValue) => {
    if (!passwordValue) return '';
    if (!PasswordVal(passwordValue)) return '비밀번호는 8글자 이상 및 특수문자를 포함해야 합니다.';
    return '';
};

export const NameVal = (nameValue) => {
    const regex = /^.{2,}$/;
    return regex.test(nameValue);
}

export const NumberVal = (numberValue) => {
    const regex = /^010\d{8}$/;
    return regex.test(numberValue)
}

export const TitleVal = (titleValue) => {
    const regex = /^.{3,}$/;
    return regex.test(titleValue);
}

export const ContentVal = (contentValue) => {
    const regex = /^.{1, 500}$/;
    return regex.test(contentValue)
}

export const CommentsVal = (commentValue) => {
    const regex = /^.{1, 100}$/;
    return regex.test(commentValue);
}

