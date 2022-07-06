import { TagsOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, InputNumber, message, Modal, Select } from 'antd';
import React, { useCallback, useState } from 'react';
import { FormLabelAlign } from 'antd/lib/form/interface';
import moment from "moment";

import {
  Artist,
} from '@/services/manager/artist';
import {
  AddPoolParam,
  useCreatePoolMutation,
} from '@/services/manager/pool';
import { format } from 'date-fns';

export type PoolAddProps = {
  artist: Artist;
};


const PoolAdd: React.FC<PoolAddProps> = (props) => {
  const artist = props.artist;
  const [modalVisibility, setModalVisibility] = useState(false);
  const [error_modal, contextHolder] = Modal.useModal();

  const [addValue, setAddValue] = useState<AddPoolParam>({
    artist_id: artist.id,
    date: format(new Date(), 'yyyy-MM-dd'),
    money: 0,
  });

  const cleanupState = useCallback(() => {
    setAddValue({
      artist_id: artist.id,
      date: format(new Date(), 'yyyy-MM-dd'),
      money: 0,
    });
  }, []);

  const validate = async(addValue: AddPoolParam) => {
    let errors: (boolean | JSX.Element)[] = [];

    errors.push(addValue.date !== '' || <p>日付を入力してください。</p>);
    errors.push(addValue.money === null || Number.isInteger(addValue.money) || <p>金額は半角数字で入力してください。</p>);

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

  const { mutateAsync: addMutation } = useCreatePoolMutation();

  const commit = async () => {
    const errors = await validate(addValue);
    if (errors) {
      error_modal.error(errors);
    } else {
      const res = await addMutation(addValue);
      if (res.result == 'error') {
        error_modal.error({title: 'エラー', content: '追加できませんでした。'}); 
      } else {
        setModalVisibility(false);
        await message.success('正常に追加しました');
      }
    }
  };

  const labelAlign: FormLabelAlign = 'left';
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    labelAlign: labelAlign,
    colon: false,
  };

  

  return (
    <>
      <Button
        icon={<TagsOutlined />}
        onClick={useCallback(() => setModalVisibility(true), [])}
      >
        金額を追加
      </Button>
      <Modal
        key="add_modal"
        afterClose={cleanupState}
        title="新規に金額を追加"
        visible={modalVisibility}
        onCancel={() => setModalVisibility(false)}
        onOk={commit}
        okText="実行"
      >
        <Form name="add_pool">
          <Form.Item
            {...formItemLayout}
            name="date"
            label="日付"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker defaultValue={moment(addValue.date, 'YYYY-MM-DD')} format="YYYY-MM-DD" onChange={(moment, e) => {
              setAddValue({ ...addValue, date: e });
            }}/>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="money"
            label="金額"
            rules={[
              {
                required: true,
              },
            ]} 
          >
            <InputNumber value={addValue.money} max={99999999} min={-99999999} defaultValue={addValue.money} onChange={(e) => {
              setAddValue({ ...addValue, money: Number(e) });
            }}/>
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </>
  );
};

export default PoolAdd;
