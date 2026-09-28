import { Request, Response } from 'express';
import { prisma } from '../db/client';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: { message: 'Email already exists' } });
    }

    // Create user
    const user = await prisma.user.create({
      data: { name, email, password } // Prototype only: plain text password
    });

    res.json({ success: true, data: { user: { id: user.id, name: user.name, email: user.email }, token: user.id } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, error: { message: 'Invalid email or password' } });
    }

    res.json({ success: true, data: { user: { id: user.id, name: user.name, email: user.email }, token: user.id } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const onboard = async (req: Request, res: Response) => {
  try {
    const { userId, companyName, industry, size, role } = req.body;
    
    const company = await prisma.company.create({
      data: {
        name: companyName,
        industry,
        size,
        userId
      }
    });

    res.json({ success: true, data: { company } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });

    const user = await prisma.user.findUnique({ 
      where: { id: token },
      include: { companies: true }
    });

    if (!user) return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });

    res.json({ success: true, data: { 
      user: { id: user.id, name: user.name, email: user.email },
      company: user.companies[0] || null
    }});
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};
