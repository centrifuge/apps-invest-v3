import { Accordion, Heading, Span, Stack } from '@chakra-ui/react'

const items = [
  {
    title: 'Who Can Invest?',
    text: 'Any non-U.S. investor is invited to invest in deJTRSY.',
    value: '1',
  },
  {
    title: 'Why Should You Buy deJTRSY?',
    text: 'Investing in deJTRSY not only grants you exposure to short-term U.S. Treasury bills but also presents a unique opportunity to earn attractive yields. With the inherent liquidity of Treasury bills, deJTRSY allows you to turn idle stablecoins into a reliable source of stable, consistent returns.',
    value: '2',
  },
  {
    title: 'What Can You Do with Your deJTRSY?',
    text: 'deJTRSY is designed for seamless integration with established DeFi building blocks. As a freely transferable token, you can leverage your holdings on leading lending platforms like Morpho or Euler, maximizing your investment potential.',
    value: '3',
  },
  {
    title: 'How Can You Sell deJTRSY?',
    text: 'Selling deJTRSY is straightforward and flexible. You have two options: complete the KYC process via [INSERT LINK TO KYC HERE] or trade tokens on decentralized exchanges such as Uniswap [INSERT LINK TO POOL HERE].',
    value: '4',
  },
  {
    title: 'What Is the Underlying Collateral?',
    text: 'deJTRSY is fundamentally backed by JTRSY, which consists of fund shares from an investment vehicle focused on short-term U.S. Treasury bills. This fund is expertly managed by Janus and Henderson Investors in partnership with Anemoy, ensuring a robust investment strategy.',
    value: '5',
  },
  {
    title: 'How Does the Value of the deJTRSY Token Appreciate?',
    text: 'deJTRSY is an accruing token, meaning your investment grows over time. When you buy a unit at a set price, its value increases with the underlying collateral performance. For instance, if you acquire 1 unit of deJTRSY, and a year later it reaches a value of $1.05, you have the opportunity to sell for a profit of $0.05. This dynamic ensures that your investment not only retains value but appreciates, enhancing your financial portfolio.',
    value: '6',
  },
]

export const FAQSection = () => {
  return (
    <Stack>
      <Heading size="lg">More about DeFi Janus Henderson Anemoy</Heading>
      <Accordion.Root multiple defaultValue={['b']}>
        {items.map((item, index) => (
          <Accordion.Item key={index} value={item.value}>
            <Accordion.ItemTrigger>
              <Span flex="1">{item.title}</Span>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody color="textSecondary">{item.text}</Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Stack>
  )
}
