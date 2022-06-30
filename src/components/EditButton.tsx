import { EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ButtonProps } from 'antd/es/button';

const EditButton: React.FC<ButtonProps> = (props) => {
  return (
    <Button type="text" size="small" {...props}>
      <EditOutlined style={{ color: 'gray' }} />
    </Button>
  );
};

export default EditButton;
