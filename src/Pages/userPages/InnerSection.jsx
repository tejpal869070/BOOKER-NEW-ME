import React from "react";
import { useLocation } from "react-router-dom";
import Dashboard from "../../Componentes/Dashboard/Dashboard";
import Downlinemember from "../../Componentes/Network/Downlinemember";
import DirextDownline from "../../Componentes/Network/DirectDownline";
import AddNewMember from "../../Componentes/Network/AddNewMember";
import MemberTree from "../../Componentes/Network/MemberTree";
import BankDeposit from "../../Componentes/Money/MoneyIn/BankDeposit";
import DepositHistory from "../../Componentes/Money/MoneyIn/DepositHistory";
import Withdrawal from "../../Componentes/Money/MoneyOut/Withdrawal";
import WithdrawalHistory from "../../Componentes/Money/MoneyOut/WithdrawalHistory";
import SendMoney from "../../Componentes/Account/SendMoney";
import TodayHistory from "../../Componentes/Account/TodayHistory";
import AccountHistory from "../../Componentes/Account/Accounthistory";
import NewInvestment from "../../Componentes/Investment/NewInvestment";
import InvestmentHistory from "../../Componentes/Investment/InvestmentHistory";
import MatchingIncome from "../../Componentes/Income/MatchingIncome";
import ReferIncome from "../../Componentes/Income/ReferIncome";
import RoiIncome from "../../Componentes/Income/RoiIncome";
import Inplay from "../../Componentes/Events/Inplay";
import Events from "../../Componentes/Events/Events";
import ColorGameTime from "../../Componentes/Casino/ColorGameTime";
import ChangePin from "../../Componentes/Account/ChangePin";
import UserProfile from "../../Componentes/Account/UserProfile";
import Wallet from "../../Componentes/Account/Wallet";
import VIP from "../../Componentes/Account/VIP";
import GameWalletHistory from "../../Componentes/Account/GameWalletHistory";
import LevelIncome from "../../Componentes/Income/LevelIncome";
import LiveCasino from "../LiveCasino";
import Refer from "../../Componentes/Account/Refer";
import InvestmentPage from "../../Componentes/Account/InvestmentPage";
import CryptoWithdrawal from "../../Componentes/Money/MoneyOut/WithdrawalOption/CryptoWithdrawal";

export default function InnerSection() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // get path and query to display content in inner section
  const paramsData = {};
  for (const [key, value] of queryParams.entries()) {
    paramsData[key] = value;
  }

  if (paramsData && paramsData.event === "inplay") {
    return <div>{<Inplay />}</div>;
  } else if (paramsData && paramsData.event === "cricket") {
    return <div> {<Events gameType="cricket" />} </div>;
  } else if (paramsData && paramsData.event === "football") {
    return <div>{<Events gameType="football" />}</div>;
  } else if (paramsData && paramsData.event === "tennis") {
    return <div>{<Events gameType="tennis" />}</div>;
  } else if (paramsData && paramsData.investment === "new-investment") {
    return <div> {<NewInvestment />} </div>;
  } else if (paramsData && paramsData.user === "profile") {
    return <div> {<UserProfile />} </div>;
  } else if (paramsData && paramsData.user === "wallet") {
    return <div> {<Wallet />} </div>;
  } else if (paramsData && paramsData.user === "VIP") {
    return <div> {<VIP />} </div>;
  } else if (paramsData && paramsData.user === "refer") {
    return <div> {<Refer />} </div>;
  } else if (paramsData && paramsData.user === "investment") {
    return <div> {<InvestmentPage />} </div>;
  } else if (paramsData && paramsData.investment === "investment-history") {
    return <div> {<InvestmentHistory />} </div>;
  } else if (paramsData && paramsData.network === "downline-member") {
    return <div>{<Downlinemember />}</div>;
  } else if (paramsData && paramsData.network === "direct-downline") {
    return <div>{<DirextDownline />}</div>;
  } else if (paramsData && paramsData.network === "add-new-member") {
    return <div>{<AddNewMember />}</div>;
  } else if (paramsData && paramsData.network === "member-tree") {
    return <div>{<MemberTree />}</div>;
  } else if (paramsData && paramsData.money === "usdt-deposit") {
    return <div> {<BankDeposit />} </div>;
  } else if (paramsData && paramsData.money === "deposit-history") {
    return <div> {<DepositHistory />} </div>;
  } else if (paramsData && paramsData.money === "withdrawal") {
    return <div>{<CryptoWithdrawal />}</div>;
  } else if (paramsData && paramsData.money === "withdrawal-history") {
    return <div> {<WithdrawalHistory />} </div>;
  } else if (paramsData && paramsData.account === "send-money") {
    return <div> {<SendMoney />} </div>;
  } else if (paramsData && paramsData.account === "today-history") {
    return <div> {<TodayHistory />} </div>;
  } else if (paramsData && paramsData.account === "account-history") {
    return <div> {<AccountHistory />} </div>;
  } else if (paramsData && paramsData.account === "game-wallet-history") {
    return <div> {<GameWalletHistory />} </div>;
  } else if (paramsData && paramsData.income === "matching-income") {
    return <div> {<MatchingIncome />} </div>;
  } else if (paramsData && paramsData.income === "refferer-income") {
    return <div> {<ReferIncome />} </div>;
  } else if (paramsData && paramsData.income === "level-income") {
    return <div> {<LevelIncome />} </div>;
  } else if (paramsData && paramsData.income === "roi-income") {
    return <div> {<RoiIncome />} </div>;
  } else if (paramsData && paramsData.change === "securityPin") {
    return <div> {<ChangePin />} </div>;
  } else if (paramsData && paramsData.colorGameType) {
    return <div> {<ColorGameTime gameType={paramsData.colorGameType} />} </div>;
  } else if (paramsData && paramsData.game !== undefined) {
    return <div> {<LiveCasino />} </div>;
  } else {
    return <div>{<Dashboard />}</div>;
  }
}
