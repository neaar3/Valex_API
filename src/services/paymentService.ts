import * as businessRepository from "../repositories/businessRepository.js"
import * as cardRepository from "../repositories/cardRepository.js"
import * as paymentRepository from "../repositories/paymentRepository.js"
import * as cardVerification from "../utils/cardVerificationUtils.js"
import * as error from "../utils/errorUtils.js"
import bcrypt from "bcrypt"

export async function newPayment(
  cardId: number, password: string, businessId: number, amount: number
){
  const card = await cardRepository.findById(cardId)
  console.log(card)

  cardVerification.unregisteredCard(card)
  cardVerification.expiredCard(card)
  cardVerification.deactivatedCard(card)

  if(!bcrypt.compareSync(password, card.password)) 
    throw error.incorrectPassword()

  const establishment = await businessRepository.findById(businessId)
  if(!establishment) throw error.unregisteredEstablishment()

  if(card.type !== establishment.type)
    throw error.differentCardType()

  //TODO: check the card balance

  await paymentRepository.insert({cardId, businessId, amount})
}