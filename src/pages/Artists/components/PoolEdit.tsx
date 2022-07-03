import { TagsOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, InputNumber, message, Modal } from 'antd';
import React, { useCallback, useState } from 'react';
import { FormLabelAlign } from 'antd/lib/form/interface';
import moment from "moment";
import { format } from 'date-fns';

import {
  Pool,
  EditPoolParam,
  useEditPoolMutation,
} from '../../../services/arrow-manage/pool';

export type PoolEditProps = {
  pool: Pool;
};


const PoolEdit: React.FC<PoolEditProps> = (props) => {
  const pool = props.pool;
  const [modalVisibility, setModalVisibility] = useState(false);
  const [error_modal, contextHolder] = Modal.useModal();

  const [editValue, setEditValue] = useState<EditPoolParam>({
    pool_id: pool?.id ?? 0,
    artist_id: pool?.artist_id ?? 0,
    date: format(new Date(pool?.date), 'yyyy-MM-dd') ?? null,
    money: pool?.money ?? 0,
  });

  const cleanupState = useCallback(() => {
    setEditValue({
      pool_id: pool?.id ?? 0,
      artist_id: pool?.artist_id ?? 0,
      date: format(new Date(pool?.date), 'yyyy-MM-dd') ?? null,
      money: pool?.money ?? 0,
    });
  }, []);

  const validate = async(editValue: EditPoolParam) => {
    let errors: (boolean | JSX.Element)[] = [];

    errors.push(editValue.date !== '' || <p>日付を入力してください。</p>);
    errors.push(editValue.money === null || Number.isInteger(editValue.money) || <p>金額は半角数字で入力してください。</p>);

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

  const { mutateAsync: addMutation } = useEditPoolMutation();

  const commit = async () => {
    const errors = await validate(editValue);
    if (errors) {
      error_modal.error(errors);
    } else {
      const res = await addMutation(editValue);
      if (res.result == 'error') {
        error_modal.error({title: 'エラー', content: '更新できませんでした。他の作家と期間がかぶっている可能性があります。'}); 
      } else {
        setModalVisibility(false);
        await message.success('正常に更新しました');
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
        変更
      </Button>
      <Modal
        key="edit_modal"
        afterClose={cleanupState}
        title="プール履歴を変更"
        visible={modalVisibility}
        onCancel={() => setModalVisibility(false)}
        onOk={commit}
        okText="変更"
      >
        <Form name="edit_pool">
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
            <DatePicker defaultValue={moment(editValue.date, 'YYYY-MM-DD')} format="YYYY-MM-DD" onChange={(moment, e) => {
              setEditValue({ ...editValue, date: e });
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
            <InputNumber value={editValue.money} max={99999999} min={-99999999} defaultValue={editValue.money} onChange={(e) => {
              setEditValue({ ...editValue, money: Number(e) });
            }}/>
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </>
  );
};

export default PoolEdit;
