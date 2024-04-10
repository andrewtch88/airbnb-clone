import Stripe from 'stripe'
import { NextResponse } from 'next/server'

import { stripe } from '@/app/libs/stripe'
import prismadb from '@/app/libs/prismadb'

const corsHeaders = {}
