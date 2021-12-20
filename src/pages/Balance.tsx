import React, {useState,useEffect,ReactElement} from 'react'
import { utils } from 'ethers'
import styled from 'styled-components'
import { Button } from '../components/base/Button'
import { BorderRad, Colors } from '../global/styles'
import { Contract } from '@ethersproject/contracts'
import { formatEther, formatUnits } from '@ethersproject/units'
import { useEtherBalance, useTokenBalance,useEthers, useToken, useContractFunction, ContractCall, useContractCall } from '@usedapp/core'
import { Container, ContentBlock, ContentRow, MainContent, Section, SectionRow } from '../components/base/base'
import { Label } from '../typography/Label'
import { TextInline } from '../typography/Text'
import { Title } from '../typography/Title'
import {TOKEN_CONTRACT_ABI} from './config';

import Crowdsale from '../abi/Crowdsale.json'

import Web3 from 'web3'
import { SpinnerIcon, CheckIcon, ExclamationIcon } from '../components/Transactions/Icons'
import { AnimatePresence, motion } from 'framer-motion'
import { AccountButton } from '../components/account/AccountButton'

const CROWDSALE_CONTRACT = '0xb57267f903e88FC4497d862f8c1F79c8eB348cFB'
const TOKEN_ADDRESS = '0x11EbC9D2E6D082A35bd4e92396b12C383599abB5';

import ContractAbi from '../abi/Crowdsale.json'

const wethInterface = new utils.Interface(ContractAbi)
//const contract = new Contract( ContractAbi,wethInterface)

interface StatusBlockProps {
  color: string
  text: string
  icon: ReactElement
}

const StatusBlock = ({ color, text, icon }: StatusBlockProps) => (
  <InformationRow
    layout
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    key={text}
  >
    <IconContainer style={{ fill: color }}>{icon}</IconContainer>
    <div style={{ color: color, textAlign: 'center' }}>{text}</div>
  </InformationRow>
)
interface StatusAnimationProps {
  isLoading: boolean;
  status: string
}

export const StatusAnimation = ({ isLoading, status }: StatusAnimationProps) => {
  const [showTransactionStatus, setShowTransactionStatus] = useState(false)
  const [timer, setTimer] = useState(
    setTimeout(() => {
      void 0
    }, 1)
  )

  useEffect(() => {
    setShowTransactionStatus(true)
    clearTimeout(timer)

    if (!isLoading) setTimer(setTimeout(() => setShowTransactionStatus(false), 5000))
  }, [status, isLoading])

  return (
    <AnimationWrapper>
      <AnimatePresence initial={false} exitBeforeEnter>
        {showTransactionStatus && status=='error' && (
          <StatusBlock
            color={Colors.Red['400']}
            text={ ''}
            icon={<ExclamationIcon />}
            key={ status}
          />
        )}
        {showTransactionStatus && status === 'loading' && (
          <StatusBlock
            color="wheat"
            text="Transaction is being mined"
            icon={<SpinnerIcon />}
            key={ status}
          />
        )}
        {showTransactionStatus && status === 'success' && (
          <StatusBlock
            color="green"
            text="Transaction successful"
            icon={<CheckIcon />}
            key={ status}
          />
        )}
      </AnimatePresence>
    </AnimationWrapper>
  )
}


export function Balance() {
  const { account } = useEthers();
  const userBalance = useTokenBalance(TOKEN_ADDRESS, account);
 // const stakingBalance = useEtherBalance(STAKING_CONTRACT);
 const [disabled, setDisabled] = useState(false)
  const tokenInfo = useToken(TOKEN_ADDRESS);
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [value, setValue] = useState('0.001')

  const tokenSymbol = tokenInfo?.symbol || '';
  //const { state, send } = useContractFunction(contract, 'buyTokens', { transactionName: 'Buy' })

  //const contractDef  = new ContractCall( CROWDSALE_CONTRACT,wethInterface, )
  //const contractBuy = useContractCall({abi: wethInterface, address: CROWDSALE_CONTRACT, method: "buyTokens",args: [{beneficiary: account }]})

  const onClick = async () => {
  // console.log(contract)
  // tokenContract.me
      setDisabled(true)
      setIsLoading(true)
      setStatus('loading')
   //   const contractBuy = useContractCall({abi: wethInterface, address: CROWDSALE_CONTRACT, method: "buyTokens",args: [{beneficiary: account }]})
   
  // send({ value: utils.parseEther('0.0001'), beneficiary: account });
   const web3 = new Web3(Web3.givenProvider)
   const accounts = await web3.eth.getAccounts();
   const tokenContract = new web3.eth.Contract(TOKEN_CONTRACT_ABI, CROWDSALE_CONTRACT)
    //setMessage('Waiting on transaction success...');
   try
   {
    var buyToken = await tokenContract.methods.buyTokens(account).send({from:  account, value: web3.utils.toWei(value, 'ether')});
  setValue('0.001')
  setIsLoading(false)
  setDisabled(false)
  setStatus('success')
   }catch(err){
    setValue('0.001')
    setIsLoading(false)
    setDisabled(false)
    setStatus('error')
   }
  }

  
  return (
    <MainContent>
      <Container>
        <Section>
        <SectionRow>
            <Title>Token Infos</Title>
            
          </SectionRow>
          <SectionRow>
          { tokenInfo ?   <ContentBlock>          

            <ContentRow>
               <Label>Token Address:</Label> <TextInline>{TOKEN_ADDRESS}</TextInline>
               </ContentRow>    
            
               <ContentRow>
               <Label>Name:</Label> <TextInline>{tokenInfo?.name}</TextInline>
               </ContentRow>     
               <ContentRow> 
                  <Label>Symbol:</Label> <TextInline>{tokenInfo?.symbol}</TextInline>
               </ContentRow>   
                 <ContentRow>  
                   <Label>Decimals:</Label> <TextInline>{tokenInfo?.decimals}</TextInline>
               </ContentRow>  
                  <ContentRow>
                      <Label>Total Supply:</Label> <TextInline>{tokenInfo?.totalSupply ? formatUnits(tokenInfo?.totalSupply, tokenInfo?.decimals) : ''}</TextInline>
             </ContentRow>          
                
             
            </ContentBlock> : null}
          </SectionRow>
          <SectionRow>
            <Title>Balance</Title>
            <AccountButton />
          </SectionRow>
          <ContentBlock>
            {
              <ContentRow>
                <InputRow>
                    <Input
                      id={`TBNB Input`}
                      type="number"
                      step="0.001"
                      min="0"
                      value={value}
                      onChange={(e) => setValue(e.currentTarget.value)}
                      disabled={disabled}
                    />
                    <FormTicker>{'TBNB'}</FormTicker>
                    <SmallButton disabled={!account || disabled} onClick={onClick}>
                    Buy
                    </SmallButton>
                  </InputRow>
                  <StatusAnimation status={status} isLoading={isLoading} />
                {/* <Label>ETH2 staking contract holds:</Label> <TextInline>{formatEther(stakingBalance)}</TextInline>{' '}
                <Label>ETH</Label> */}
              </ContentRow>
            }
            {account && (
              <ContentRow>
                <Label>Account:</Label> <TextInline>{account}</TextInline>
              </ContentRow>
            )}
            {userBalance && (
              <ContentRow>
                <Label>{tokenSymbol} balance:</Label> <TextInline>{formatEther(userBalance)}</TextInline> <Label>{tokenSymbol}</Label>
              </ContentRow>
            )}
          </ContentBlock>
        </Section>
      </Container>
    </MainContent>
  )
}



const SmallButton = styled(Button)`
  display: flex;
  justify-content: center;
  min-width: 95px;
  height: unset;
  padding: 8px 24px;
  color: wheat;
  &:disabled {
    color: ${Colors.Gray['600']};
    cursor: unset;
  }

  &:disabled:hover,
  &:disabled:focus {
    background-color: unset;
    color: unset;
  }

  
`
const IconContainer = styled.div`
  margin-right: 15px;
  height: 40px;
  width: 40px;
  float: left;
`
const Input = styled.input`
  height: 40px;
  width: 120px;
  padding: 0 0 0 24px;
  border: 0;
  border-radius: ${BorderRad.m};
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    outline: transparent auto 1px;
  }

  &:focus-visible {
    box-shadow: inset 0 0 0 2px ${Colors.Black['900']};
  }
`
const InputRow = styled.div`
  display: flex;
  margin: 0 auto;
  color: ${Colors.Gray['600']};
  align-items: center;
  border: ${Colors.Gray['300']} 1px solid;
  border-radius: ${BorderRad.m};
  overflow: hidden;
`

const FormTicker = styled.div`
  padding: 0 16px;
`


const InformationRow = styled(motion.div)`
  height: 60px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: auto;
`

const AnimationWrapper = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  margin: 10px;
`
