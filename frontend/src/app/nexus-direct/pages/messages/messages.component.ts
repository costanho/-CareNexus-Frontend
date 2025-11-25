import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService, Message } from '../../services/message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  currentMessage = '';
  loading = true;
  error = '';
  successMessage = '';
  currentPage = 0;
  pageSize = 20;
  totalPages = 0;
  selectedConversation: any = null;
  conversationMessages: Message[] = [];
  showConversationList = true;
  private destroy$ = new Subject<void>();

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  private loadMessages(): void {
    this.loading = true;
    this.error = '';
    this.messageService.getMessages(this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.messages = response.content || [];
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load messages:', err);
          this.error = 'Failed to load messages. Please try again.';
          this.loading = false;
        }
      });
  }

  selectConversation(personId: number, personName?: string): void {
    this.showConversationList = false;
    this.selectedConversation = { id: personId, name: personName };
    this.loadConversation(personId);
  }

  private loadConversation(personId: number): void {
    this.loading = true;
    this.messageService.getConversation(personId, 0, 50)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.conversationMessages = response.content || [];
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load conversation:', err);
          this.error = 'Failed to load conversation.';
          this.loading = false;
        }
      });
  }

  sendMessage(): void {
    if (!this.currentMessage.trim() || !this.selectedConversation) {
      return;
    }

    const messageData = {
      receiverId: this.selectedConversation.id,
      content: this.currentMessage
    };

    this.messageService.sendMessage(messageData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.conversationMessages.push(response);
          this.currentMessage = '';
          this.successMessage = 'Message sent!';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (err) => {
          console.error('Failed to send message:', err);
          this.error = 'Failed to send message. Please try again.';
        }
      });
  }

  backToConversationList(): void {
    this.showConversationList = true;
    this.selectedConversation = null;
    this.conversationMessages = [];
    this.currentMessage = '';
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadMessages();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadMessages();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
