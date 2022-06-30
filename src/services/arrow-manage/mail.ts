import { CompanyDetail } from './company';

type MailData = {
  to: string;
  subject?: string;
  body?: string;
};

export function generateMailto(data: MailData): string {
  const url = new URL(`mailto:${data.to}`);
  data.subject && url.searchParams.append('subject', data.subject);
  data.body && url.searchParams.append('body', data.body);
  return url.toString();
}

export function generateTrialEndMailto(company: CompanyDetail) {
  const staffLastName = company.staffName.split(' ')[0];
  const subject = '[ARROW]無料期間終了のお知らせ';
  const body = `${company.name} ${staffLastName}

お世話になっております。

ARROWの無料トライアルの期限がまもなくとなっております。
引き続きARROWをご利用いただける場合は、本登録の作業をお願いいたします。
右上のボタンから、「〇〇さん 会社ログイン」→「本登録」から本登録の画面に移ります。

ご不明な点がありましたら、お問い合わせください。
何卒よろしくお願いいたします。

--`;
  return generateMailto({ to: company.email, subject, body });
}
