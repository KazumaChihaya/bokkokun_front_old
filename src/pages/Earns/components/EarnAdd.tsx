import {
  AddEarnParam, useCreateEarnMutation,
} from '@/services/arrow-manage/earn';
import React, { useCallback, useRef, useState } from 'react';
import { format } from 'date-fns';
import { Button, DatePicker, Descriptions, Input, InputNumber, message, Modal } from 'antd';
import moment from 'moment';
import { TagsOutlined } from '@ant-design/icons';

export type EarnAddProps = {
  activeKey: string,
};

const EarnAdd: React.FC<EarnAddProps> = ({
  activeKey,
}) => {

  const [error_modal, contextHolder] = Modal.useModal();

  const [addValue, setAddValue] = useState<AddEarnParam>({
    artist_code: '',
    code: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    store_id: Number(activeKey),
    money: '',
  });

  const validate = async(addValue: AddEarnParam) => {
    let errors: (boolean | JSX.Element)[] = [];

    errors.push(addValue.artist_code !== '' || <p>作家記号を入力してください。</p>);
    errors.push(addValue.code !== '' || <p>作品番号を入力してください。</p>);
    errors.push(addValue.money === null || Number.isInteger(addValue.money) || <p>価格は半角数字で入力してください。</p>);
    errors.push(addValue.date !== '' || <p>販売日を入力してください。</p>);

    errors = errors.filter(error => typeof error !== 'boolean');
    if (errors.length == 0) {
      return null;
    } else {
      return {
        title: 'エラー',
        content: errors,
      };
    }
  }

  const cleanupState = () => {
    setAddValue({
      artist_code: '',
      code: '',
      date: addValue.date,
      store_id: Number(activeKey),
      money: '',
    });
  };

  const { mutateAsync: addMutation } = useCreateEarnMutation();

  const commit = async () => {
    const errors = await validate(addValue);
    if (errors) {
      error_modal.error(errors);
    } else {
      const res = await addMutation(addValue);
      if (res.result == 'error') {
        error_modal.error({title: 'エラー', content: '追加できませんでした。作家記号が間違っている可能性があります。'}); 
      } else {
        cleanupState();
        inputEl.current.focus();
        await message.success('正常に追加しました');
      }
    }
  };

  const onKeyPress = (e) => {
    if (e.key == 'Enter') {
      commit();
    }
  }

  const inputEl = useRef(null)


  return (
    <>
      <Descriptions size="small" layout="vertical" column={5} bordered>
        <Descriptions.Item label="作家記号">
          <Input style={{width: '100px'}} value={addValue.artist_code} defaultValue={addValue.artist_code} onKeyPress={onKeyPress} ref={inputEl} onChange={(e) => {
            setAddValue({ ...addValue, artist_code: e.target.value });
          }}/>
        </Descriptions.Item>
        <Descriptions.Item label="作品番号">
          <Input style={{width: '100px'}} value={addValue.code} defaultValue={addValue.code} onKeyPress={onKeyPress} onChange={(e) => {
            setAddValue({ ...addValue, code: e.target.value });
          }}/>
        </Descriptions.Item>
        <Descriptions.Item label="価格">
          ¥ <InputNumber style={{width: '100px'}} value={addValue.money} min={0} defaultValue={addValue.money} onKeyPress={onKeyPress} onChange={(e) => {
            setAddValue({ ...addValue, money: Number(e) });
          }}/>
        </Descriptions.Item>
        <Descriptions.Item label="売上日">
          <DatePicker defaultValue={moment(addValue.date, 'YYYY-MM-DD')} format="YYYY-MM-DD" onChange={(moment, e) => {
            setAddValue({ ...addValue, date: e });
          }}/>
        </Descriptions.Item>
        <Descriptions.Item label="追加">
          <Button
            icon={<TagsOutlined />}
            onClick={commit}
          >
            追加
          </Button>
        </Descriptions.Item>
      </Descriptions>
      {contextHolder}
    </>
  );
};

export default EarnAdd;
