const router = require('express').Router();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


router.post('/', async (req, res) => {
    const { businessType, category, name, phoneNumber, desc } = req.body;

    if (!businessType || !category || !name || !phoneNumber || !desc) {
        return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'cutax_0801@naver.com',
        subject: `${name}님이 문의를 보냈습니다.`,
        text: `
      사업 유형: ${businessType}
      카테고리: ${category}
      이름: ${name}
      전화번호: ${phoneNumber}
      설명: ${desc}
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: '이메일이 성공적으로 발송되었습니다.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '이메일 전송 중 오류가 발생했습니다.' });
    }
});

module.exports = router;
