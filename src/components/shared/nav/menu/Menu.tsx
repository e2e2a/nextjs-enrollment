import React from 'react';
import { MenuDropdown } from './MenuDropdown';
interface IProps {
  classname: any;
  session: any;
}
const Menu = ({ classname, session }: IProps) => {
  return (
    <div className={`${classname}`}>
      <MenuDropdown session={session} />
    </div>
  );
};

export default Menu;
