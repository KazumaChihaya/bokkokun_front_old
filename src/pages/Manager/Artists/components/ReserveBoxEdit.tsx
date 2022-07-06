import { TagsOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, message, Modal } from 'antd';
import React, { useCallback, useState } from 'react';
import { FormLabelAlign } from 'antd/lib/form/interface';
import moment from "moment";
import { format } from 'date-fns';

import {
  ReserveBox,
  EditReserveBoxParam,
  useEditReserveBoxMutation,
} from '@/services/arrow-manage/artist';

export type ArtistEditProps = {
  reserve_box: ReserveBox;
};


const ReserveBoxEdit: React.FC<ArtistEditProps> = (props) => {
  const reserve_box = props.reserve_box;
  const [modalVisibility, setModalVisibility] = useState(false);
  const [error_modal, contextHolder] = Modal.useModal();

  console.log(reserve_box);

  const [deleteValue, setEditValue] = useState<EditReserveBoxParam>({
    reserve_box_id: reserve_box?.id ?? 0,
    artist_id: reserve_box?.artist?.id ?? 0,
    box_id: reserve_box?.box_id ?? 0,
    started_on: format(new Date(reserve_box?.started_on), 'yyyy-MM-dd') ?? null,
    ended_on: reserve_box?.ended_on ? format(new Date(reserve_box?.ended_on), 'yyyy-MM-dd') : null,
  });

  const cleanupState = useCallback(() => {
    setEditValue({
      reserve_box_id: reserve_box?.id ?? 0,
      artist_id: reserve_box?.artist?.id ?? 0,
      box_id: reserve_box?.box_id ?? 0,
      started_on: format(new Date(reserve_box?.started_on), 'yyyy-MM-dd') ?? null,
      ended_on: reserve_box?.ended_on ? format(new Date(reserve_box?.ended_on), 'yyyy-MM-dd') : null,
    });
  }, []);

  const validate = async(deleteValue: EditReserveBoxParam) => {
    let errors: (boolean | JSX.Element)[] = [];

    errors.push(deleteValue.started_on !== '' || <p>契約開始年月日を入力してください。</p>);

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

  const { mutateAsync: addMutation } = useEditReserveBoxMutation();

  const commit = async () => {
    const errors = await validate(deleteValue);
    if (errors) {
      error_modal.error(errors);
    } else {
      const res = await addMutation(deleteValue);
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
        title="契約履歴を変更"
        visible={modalVisibility}
        onCancel={() => setModalVisibility(false)}
        onOk={commit}
        okText="変更"
      >
        <Form name="edit_reserve_box">
        <Form.Item
            {...formItemLayout}
            name="started_on"
            label="契約日"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker defaultValue={deleteValue.started_on ? moment(deleteValue.started_on, 'YYYY-MM-DD') : undefined} format="YYYY-MM-DD" onChange={(moment, e) => {
              setEditValue({ ...deleteValue, started_on: e });
            }}/>
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name="ended_on"
            label="解約日"
          >
            <DatePicker defaultValue={deleteValue.ended_on ? moment(deleteValue.ended_on, 'YYYY-MM-DD') : undefined} format="YYYY-MM-DD" onChange={(moment, e) => {
              setEditValue({ ...deleteValue, ended_on: e == '' ? null : e });
            }}/>
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </>
  );
};

export default ReserveBoxEdit;
